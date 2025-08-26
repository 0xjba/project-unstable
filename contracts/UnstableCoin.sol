// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title UnstableCoin - The World's Most Unstable Token
 * @dev An experimental ERC20 token that randomly mutates holder balances
 * @dev Uses TEN's secure RNG for unpredictable volatility
 */
contract UnstableCoin is ERC20, AccessControl, ReentrancyGuard, Pausable {
    
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    // ========== HOLDER MANAGEMENT ==========
    
    // Efficient holder tracking with dense indexing
    mapping(uint256 => address) public indexedHolders;
    mapping(address => uint256) public holderIndex;
    mapping(address => bool) public isHolder;
    uint256 public holderCount;
    
    // ========== DESTABILIZATION CONFIG ==========
    
    struct DestabilizationConfig {
        uint256 minHoldersToAffect;      // Minimum holders to destabilize
        uint256 maxHoldersToAffect;      // Maximum holders to destabilize  
        uint256 minBalance;              // Minimum balance to be eligible
        uint256 maxTotalSupply;          // Maximum allowed total supply
        uint256 minTotalSupply;          // Minimum allowed total supply
        uint256 cooldownPeriod;          // Cooldown between destabilizations
    }
    
    DestabilizationConfig public config;
    
    // ========== KEEPER & TIMING ==========
    
    mapping(address => bool) public authorizedKeepers;
    uint256 public lastDestabilization;
    uint256 public destabilizationCount;
    
    // ========== STATISTICS ==========
    
    uint256 private totalBurned;
    uint256 private totalMinted;
    uint256 private eliminatedCount;
    
    // ========== EVENTS ==========
    
    event DestabilizationExecuted(
        uint256 indexed round,
        uint256 holdersAffected,
        uint256 totalBurned,
        uint256 totalMinted,
        uint256 timestamp
    );
    
    event HolderDestabilized(
        address indexed holder,
        bool isMint,
        uint256 percentage,
        uint256 oldBalance,
        uint256 newBalance
    );
    
    event KeeperAuthorized(address indexed keeper);
    event KeeperDeauthorized(address indexed keeper);
    event ConfigUpdated();
    
    // ========== MODIFIERS ==========
    
    modifier onlyKeeper() {
        require(authorizedKeepers[msg.sender], "Not authorized keeper");
        _;
    }
    
    modifier canDestabilize() {
        require(
            block.timestamp >= lastDestabilization + config.cooldownPeriod,
            "Cooldown period not met"
        );
        require(holderCount >= config.minHoldersToAffect, "Not enough holders");
        require(totalSupply() >= config.minTotalSupply, "Total supply too low");
        _;
    }
    
    // ========== CONSTRUCTOR ==========
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address initialOwner
    ) ERC20(name, symbol) {
        
        // Set up roles
        _grantRole(DEFAULT_ADMIN_ROLE, initialOwner);
        _grantRole(MINTER_ROLE, initialOwner);
        
        // Initialize configuration
        config = DestabilizationConfig({
            minHoldersToAffect: 0,
            maxHoldersToAffect: 10,
            minBalance: 1,              // Anyone with 1+ wei can be affected
            maxTotalSupply: 1000000000 * 10**decimals(), // 1B max supply
            minTotalSupply: 1000 * 10**decimals(),        // 1K min supply
            cooldownPeriod: 10 minutes     // 10 minutes between destabilizations
        });
        
        // Mint initial supply and add to holder list
        if (initialSupply > 0) {
            _mint(initialOwner, initialSupply);
            _addHolder(initialOwner);
        }
        
        // Owner is the first authorized keeper
        authorizedKeepers[initialOwner] = true;
        emit KeeperAuthorized(initialOwner);
    }
    
    // ========== MINTING FUNCTION ==========
    
    /**
     * @dev Mint tokens to address (called by faucet or admin)
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Cannot mint zero amount");
        require(totalSupply() + amount <= config.maxTotalSupply, "Would exceed max supply");
        
        _mint(to, amount);
        
        // Add to holder list if not already present
        if (!isHolder[to]) {
            _addHolder(to);
        }
    }
    
    // ========== DESTABILIZATION CORE ==========
    
    /**
     * @dev The main destabilization function - randomly mutates holder balances
     * @dev Uses TEN's secure RNG for all random decisions
     */
    function destabilize() external onlyKeeper canDestabilize nonReentrant {
        
        // Determine how many holders to affect using secure randomness
        uint256 numToAffect = _getRandomHolderCount();
        
        // Select random holders to destabilize
        address[] memory selectedHolders = _selectRandomHolders(numToAffect);
        
        uint256 roundBurned = 0;
        uint256 roundMinted = 0;
        
        // Process each selected holder
        for (uint256 i = 0; i < selectedHolders.length; i++) {
            address holder = selectedHolders[i];
            uint256 currentBalance = balanceOf(holder);
            
            // Skip if balance too low
            if (currentBalance < config.minBalance) continue;
            
            // Generate random mutation parameters
            (bool shouldMint, uint256 percentage) = _generateMutationParams(i);
            
            // Calculate mutation amount
            uint256 mutationAmount = (currentBalance * percentage) / 10000;
            
            if (shouldMint) {
                // Mint tokens (increase balance)
                if (totalSupply() + mutationAmount <= config.maxTotalSupply) {
                    _mint(holder, mutationAmount);
                    roundMinted += mutationAmount;
                    totalMinted += mutationAmount;
                }
            } else {
                // Burn tokens (decrease balance)
                if (mutationAmount > 0) {
                    // Ensure we don't burn more than available
                    uint256 burnAmount = mutationAmount > currentBalance ? currentBalance : mutationAmount;
                    _burn(holder, burnAmount);
                    roundBurned += burnAmount;
                    totalBurned += burnAmount;
                    
                    // Remove from holder list if balance becomes zero
                    if (balanceOf(holder) == 0) {
                        _removeHolder(holder);
                        eliminatedCount++;
                    }
                }
            }
            
            // Emit event
            emit HolderDestabilized(
                holder,
                shouldMint,
                percentage,
                currentBalance,
                balanceOf(holder)
            );
        }
        
        // Update state
        lastDestabilization = block.timestamp;
        destabilizationCount++;
        
        // Emit public event
        emit DestabilizationExecuted(
            destabilizationCount,
            selectedHolders.length,
            roundBurned,
            roundMinted,
            block.timestamp
        );
    }
    
    // ========== RANDOMNESS FUNCTIONS ==========
    
    /**
     * @dev Generate random number of holders to affect
     */
    function _getRandomHolderCount() private view returns (uint256) {
        // Simple: just pick random number between min and max
        return _getRandomInRange(
            config.minHoldersToAffect,
            config.maxHoldersToAffect
        );
    }
    
    /**
     * @dev Select random holders from the holder list
     */
    function _selectRandomHolders(uint256 count) private view returns (address[] memory) {
        if (count == 0) return new address[](0);
        
        address[] memory selected = new address[](count);
        address[10] memory duplicateCheck; // Max 10 mutations, simple array
        uint256 uniqueCount = 0;
        
        for (uint256 i = 0; i < count && uniqueCount < count; i++) {
            uint256 randomIndex = _getRandomInRange(0, holderCount - 1);
            address holder = indexedHolders[randomIndex];
            
            // Skip zero address (shouldn't happen but safety check)
            if (holder == address(0)) continue;
            
            // Simple duplicate check for max 10 items
            bool isDuplicate = false;
            for (uint256 j = 0; j < uniqueCount; j++) {
                if (duplicateCheck[j] == holder) {
                    isDuplicate = true;
                    break;
                }
            }
            
            if (!isDuplicate) {
                selected[uniqueCount] = holder;
                duplicateCheck[uniqueCount] = holder;
                uniqueCount++;
            }
        }
        
        // Return correctly sized array
        address[] memory result = new address[](uniqueCount);
        for (uint256 i = 0; i < uniqueCount; i++) {
            result[i] = selected[i];
        }
        return result;
    }
    
    /**
     * @dev Generate random mutation parameters for a holder
     */
    function _generateMutationParams(uint256 holderIndex) private view returns (bool shouldMint, uint256 percentage) {
        // Generate random values using secure entropy
        uint256 randomValue = uint256(keccak256(abi.encodePacked(
            block.prevrandao,  // TEN's secure randomness
            holderIndex,
            block.timestamp
        )));
        
        // Determine mint vs burn (50/50 chance)
        shouldMint = (randomValue % 2) == 0;
        
        // Generate random percentage (0-100% represented as 0-10000 basis points)
        percentage = (randomValue >> 8) % 10001; // 0 to 10000 basis points
    }
    
    /**
     * @dev Generate random number in range [min, max] inclusive
     */
    function _getRandomInRange(uint256 min, uint256 max) private view returns (uint256) {
        if (min >= max) return min;
        
        uint256 randomValue = uint256(keccak256(abi.encodePacked(
            block.prevrandao,  // TEN's secure randomness is sufficient
            block.timestamp
        )));
        
        return min + (randomValue % (max - min + 1));
    }
    
    // ========== HOLDER MANAGEMENT ==========
    
    /**
     * @dev Add holder to the indexed list
     */
    function _addHolder(address holder) private {
        if (!isHolder[holder]) {
            indexedHolders[holderCount] = holder;
            holderIndex[holder] = holderCount;
            isHolder[holder] = true;
            holderCount++;
        }
    }
    
    /**
     * @dev Remove holder using swap-and-pop for dense indexing
     */
    function _removeHolder(address holder) private {
        if (isHolder[holder]) {
            uint256 indexToRemove = holderIndex[holder];
            uint256 lastIndex = holderCount - 1;
            
            // Swap with last element
            if (indexToRemove != lastIndex) {
                address lastHolder = indexedHolders[lastIndex];
                indexedHolders[indexToRemove] = lastHolder;
                holderIndex[lastHolder] = indexToRemove;
            }
            
            // Remove last element
            delete indexedHolders[lastIndex];
            delete holderIndex[holder];
            isHolder[holder] = false;
            holderCount--;
        }
    }
    
    // ========== ERC20 OVERRIDES ==========
    
    /**
     * @dev Override transfer to maintain holder list
     */
    function transfer(address to, uint256 amount) public override returns (bool) {
        address from = msg.sender;
        
        // Execute transfer
        bool success = super.transfer(to, amount);
        
        if (success) {
            // Add recipient to holder list if not present
            if (balanceOf(to) > 0 && !isHolder[to]) {
                _addHolder(to);
            }
            
            // Remove sender from holder list if balance is zero
            if (balanceOf(from) == 0 && isHolder[from]) {
                _removeHolder(from);
            }
        }
        
        return success;
    }
    
    /**
     * @dev Override transferFrom to maintain holder list
     */
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        // Execute transfer
        bool success = super.transferFrom(from, to, amount);
        
        if (success) {
            // Add recipient to holder list if not present
            if (balanceOf(to) > 0 && !isHolder[to]) {
                _addHolder(to);
            }
            
            // Remove sender from holder list if balance is zero
            if (balanceOf(from) == 0 && isHolder[from]) {
                _removeHolder(from);
            }
        }
        
        return success;
    }
    
    // ========== ADMIN FUNCTIONS ==========
    
    /**
     * @dev Authorize a keeper
     */
    function authorizeKeeper(address keeper) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(keeper != address(0), "Invalid keeper address");
        authorizedKeepers[keeper] = true;
        emit KeeperAuthorized(keeper);
    }
    
    /**
     * @dev Deauthorize a keeper
     */
    function deauthorizeKeeper(address keeper) external onlyRole(DEFAULT_ADMIN_ROLE) {
        authorizedKeepers[keeper] = false;
        emit KeeperDeauthorized(keeper);
    }
    
    /**
     * @dev Grant minter role to address (for faucet contract)
     */
    function grantMinterRole(address minter) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(MINTER_ROLE, minter);
    }
    
    /**
     * @dev Revoke minter role from address
     */
    function revokeMinterRole(address minter) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(MINTER_ROLE, minter);
    }
    
    /**
     * @dev Update destabilization configuration
     */
    function updateConfig(DestabilizationConfig memory newConfig) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newConfig.minHoldersToAffect <= newConfig.maxHoldersToAffect, "Invalid holder range");
        require(newConfig.minTotalSupply <= newConfig.maxTotalSupply, "Invalid supply range");
        require(newConfig.cooldownPeriod >= 1 minutes, "Cooldown too short");
        
        config = newConfig;
        emit ConfigUpdated();
    }
    
    /**
     * @dev Emergency pause mechanism
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
    
    // ========== VIEW FUNCTIONS ==========
    
    /**
     * @dev Get statistics
     */
    function getStats() external view returns (
        uint256 _holderCount,
        uint256 _totalBurned,
        uint256 _totalMinted,
        uint256 _destabilizationCount,
        uint256 _timeSinceLastDestabilization,
        uint256 _eliminatedCount
    ) {
        return (
            holderCount,
            totalBurned,
            totalMinted,
            destabilizationCount,
            lastDestabilization > 0 ? block.timestamp - lastDestabilization : 0,
            eliminatedCount
        );
    }
    
    /**
     * @dev Check if destabilization is ready
     */
    function canDestabilizeNow() external view returns (bool) {
        return block.timestamp >= lastDestabilization + config.cooldownPeriod &&
               holderCount >= config.minHoldersToAffect &&
               totalSupply() >= config.minTotalSupply;
    }
    
    /**
     * @dev Get next destabilization time
     */
    function getNextDestabilizationTime() external view returns (uint256) {
        return lastDestabilization + config.cooldownPeriod;
    }
}