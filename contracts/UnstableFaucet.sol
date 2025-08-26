// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IUnstableCoin {
    function mint(address to, uint256 amount) external;
    function balanceOf(address account) external view returns (uint256);
    function burn(address from, uint256 amount) external;  // Add burn function
    function totalSupply() external view returns (uint256);
}

/**
 * @title UnstableFaucet - Mood-Based Faucet with Self-Expiring Anti-Spam
 * @dev A faucet that randomly steals, gives, or breaks based on random moods
 */
contract UnstableFaucet {
    
    IUnstableCoin public immutable unstableCoin;
    address public immutable owner;
    address public constant UNSTABLE_SINK = 0x000000000000000000000000000000000000dEaD;
    
    // ========== FAUCET MOODS ==========
    
    enum FaucetMood { GENEROUS, NORMAL, STINGY, BROKEN, THIEF }
    
    // ========== ANTI-SPAM ==========
    
    mapping(address => uint256) public lastClaim;
    uint256 public constant BASE_COOLDOWN = 24 hours;
    uint256 public constant PENALTY_COOLDOWN = 48 hours;
    
    // ========== STATISTICS ==========
    
    uint256 public totalClaims;
    uint256 public totalDistributed;
    uint256 public totalStolen;
    bool public isPaused;
    
    // ========== EVENTS ==========
    
    event FaucetInteraction(address indexed user, FaucetMood mood, uint256 amount);
    event FaucetPaused();
    event FaucetUnpaused();
    
    // ========== MODIFIERS ==========
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier notPaused() {
        require(!isPaused, "Faucet is paused");
        _;
    }
    
    modifier antiSpam() {
        uint256 timeSinceLastClaim = block.timestamp - lastClaim[msg.sender];
        
        // Calculate required cooldown with escalating penalty
        uint256 requiredCooldown;
        if (timeSinceLastClaim < PENALTY_COOLDOWN && lastClaim[msg.sender] != 0) {
            requiredCooldown = PENALTY_COOLDOWN; // Escalate if claiming too frequently
        } else {
            requiredCooldown = BASE_COOLDOWN; // Normal cooldown
        }
        
        require(timeSinceLastClaim >= requiredCooldown, "Cooldown active");
        lastClaim[msg.sender] = block.timestamp;
        _;
    }
    
    // ========== CONSTRUCTOR ==========
    
    constructor(address _unstableCoin) {
        require(_unstableCoin != address(0), "Invalid token address");
        unstableCoin = IUnstableCoin(_unstableCoin);
        owner = msg.sender;
    }
    
    // ========== MAIN FAUCET FUNCTION ==========
    
    /**
     * @dev Claim tokens from the unstable faucet - you never know what will happen!
     */
    function claim() external notPaused antiSpam {
        // Generate single random value for efficiency
        uint256 randomValue = uint256(keccak256(abi.encodePacked(
            block.prevrandao,
            block.timestamp,
            msg.sender,
            totalClaims
        )));
        
        // Pick random mood (equal probability for all 5 moods)
        FaucetMood mood = FaucetMood(randomValue % 5);
        
        if (mood == FaucetMood.THIEF) {
            _executeTheft(msg.sender);
        } else if (mood == FaucetMood.BROKEN) {
            _executeBroken(msg.sender);
        } else if (mood == FaucetMood.GENEROUS) {
            uint256 amount = (5000 + (randomValue >> 8) % 10001) * 10**18; // 5K-15K tokens
            _processClaim(msg.sender, amount, mood);
        } else if (mood == FaucetMood.STINGY) {
            uint256 amount = (1 + (randomValue >> 16) % 100) * 10**18; // 1-100 tokens
            _processClaim(msg.sender, amount, mood);
        } else { // NORMAL
            uint256 amount = (500 + (randomValue >> 24) % 1501) * 10**18; // 500-2000 tokens
            _processClaim(msg.sender, amount, mood);
        }
        
        totalClaims++;
    }
    
    // ========== MOOD IMPLEMENTATIONS ==========
    
    function _executeTheft(address victim) private {
        uint256 victimBalance = unstableCoin.balanceOf(victim);
        
        if (victimBalance == 0) {
            emit FaucetInteraction(victim, FaucetMood.THIEF, 0);
            return;
        }
        
        // Use block.prevrandao for theft percentage (1-50%)
        uint256 stealPercentage = 1 + (uint256(keccak256(abi.encodePacked(
            block.prevrandao,
            victim,
            block.timestamp
        ))) % 50);
        
        uint256 stolenAmount = (victimBalance * stealPercentage) / 100;
        
        // Burn the stolen tokens directly (no approval needed)
        unstableCoin.burn(victim, stolenAmount);
        
        totalStolen += stolenAmount;
        emit FaucetInteraction(victim, FaucetMood.THIEF, stolenAmount);
    }
    
    function _executeBroken(address user) private {
        emit FaucetInteraction(user, FaucetMood.BROKEN, 0);
        // User still has cooldown but gets nothing
    }
    
    function _processClaim(address claimer, uint256 amount, FaucetMood mood) private {
        unstableCoin.mint(claimer, amount);
        totalDistributed += amount;
        emit FaucetInteraction(claimer, mood, amount);
    }
    
    // ========== RANDOMNESS ==========
    
    // Optimized random number generation using block.prevrandao
    // This function is no longer used but kept for potential future use
    
    // ========== ADMIN FUNCTIONS ==========
    
    function pause() external onlyOwner {
        isPaused = true;
        emit FaucetPaused();
    }
    
    function unpause() external onlyOwner {
        isPaused = false;
        emit FaucetUnpaused();
    }
    
    // ========== VIEW FUNCTIONS ==========
    
    function canClaim(address user) external view returns (bool) {
        if (isPaused) return false;
        
        uint256 timeSinceLastClaim = block.timestamp - lastClaim[user];
        uint256 requiredCooldown;
        
        if (timeSinceLastClaim < PENALTY_COOLDOWN && lastClaim[user] != 0) {
            requiredCooldown = PENALTY_COOLDOWN;
        } else {
            requiredCooldown = BASE_COOLDOWN;
        }
        
        return timeSinceLastClaim >= requiredCooldown;
    }
    
    function timeUntilNextClaim(address user) external view returns (uint256) {
        if (lastClaim[user] == 0) return 0;
        
        uint256 timeSinceLastClaim = block.timestamp - lastClaim[user];
        uint256 requiredCooldown;
        
        if (timeSinceLastClaim < PENALTY_COOLDOWN) {
            requiredCooldown = PENALTY_COOLDOWN;
        } else {
            requiredCooldown = BASE_COOLDOWN;
        }
        
        if (timeSinceLastClaim >= requiredCooldown) return 0;
        return requiredCooldown - timeSinceLastClaim;
    }
    
    function getFaucetStats() external view returns (
        uint256 _totalClaims,
        uint256 _totalDistributed,
        uint256 _totalStolen,
        bool _isPaused
    ) {
        return (totalClaims, totalDistributed, totalStolen, isPaused);
    }
    
    function getUserLastClaim(address user) external view returns (uint256) {
        return lastClaim[user];
    }
}