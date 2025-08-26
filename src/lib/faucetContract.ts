import { ethers } from 'ethers';
import { CONTRACT_CONFIG, MOCK_CONFIG } from './config';

// UnstableFaucet ABI - only the functions we need
const UNSTABLE_FAUCET_ABI = [
  'function claim() external',
  'function canClaim(address user) external view returns (bool)',
  'function timeUntilNextClaim(address user) external view returns (uint256)',
  'function getFaucetStats() external view returns (uint256, uint256, uint256, bool)',
  'function getUserLastClaim(address user) external view returns (uint256)',
  'event FaucetInteraction(address indexed user, uint8 mood, uint256 amount)'
];

export interface FaucetStats {
  totalClaims: number;
  totalDistributed: string;
  totalStolen: string;
  isPaused: boolean;
}

class FaucetContractService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(CONTRACT_CONFIG.RPC_URL);
    // TODO: Replace with actual faucet contract address
    this.contract = new ethers.Contract('0x0000000000000000000000000000000000000000', UNSTABLE_FAUCET_ABI, this.provider);
  }

  private formatTokenAmount(amount: bigint): string {
    return ethers.formatUnits(amount, 18);
  }

  async canClaim(userAddress: string): Promise<boolean> {
    if (MOCK_CONFIG.ENABLED) {
      return true; // In mock mode, always allow claiming
    }
    
    try {
      return await this.contract.canClaim(userAddress);
    } catch (error) {
      console.error('Error checking canClaim:', error);
      return false;
    }
  }

  async timeUntilNextClaim(userAddress: string): Promise<number> {
    if (MOCK_CONFIG.ENABLED) {
      return 0; // In mock mode, no cooldown
    }
    
    try {
      const timeRemaining = await this.contract.timeUntilNextClaim(userAddress);
      return Number(timeRemaining);
    } catch (error) {
      console.error('Error getting timeUntilNextClaim:', error);
      return 0;
    }
  }

  async getFaucetStats(): Promise<FaucetStats> {
    try {
      const [totalClaims, totalDistributed, totalStolen, isPaused] = await this.contract.getFaucetStats();
      return {
        totalClaims: Number(totalClaims),
        totalDistributed: this.formatTokenAmount(totalDistributed),
        totalStolen: this.formatTokenAmount(totalStolen),
        isPaused: isPaused
      };
    } catch (error) {
      console.error('Error fetching faucet stats:', error);
      return {
        totalClaims: 0,
        totalDistributed: '0',
        totalStolen: '0',
        isPaused: false
      };
    }
  }

  async claim(userAddress: string): Promise<void> {
    if (MOCK_CONFIG.ENABLED) {
      // In mock mode, simulate a successful claim
      return Promise.resolve();
    }
    
    try {
      // This would need a signer for actual transactions
      // For now, just simulate the call
      await this.contract.claim();
    } catch (error) {
      console.error('Error claiming:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const faucetContractService = new FaucetContractService(); 