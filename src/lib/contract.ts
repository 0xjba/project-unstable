import { ethers } from 'ethers';
import { CONTRACT_CONFIG, MOCK_CONFIG } from './config';
import { getTimeUntil } from './timeUtils';

// UnstableCoin ABI - only the functions we need
const UNSTABLE_COIN_ABI = [
  'function holderCount() external view returns (uint256)',
  'function totalSupply() external view returns (uint256)',
  'function getStats() external view returns (uint256, uint256, uint256, uint256, uint256, uint256)',
  'function canDestabilizeNow() external view returns (bool)',
  'function getNextDestabilizationTime() external view returns (uint256)'
];

export interface ContractStats {
  holderCount: number;
  totalSupply: string;
  totalBurned: string;
  totalMinted: string;
  destabilizationCount: number;
  eliminatedCount: number;
  canDestabilizeNow: boolean;
  nextDestabilizationTime: number;
  cooldownRemaining: number;
}

class ContractService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(CONTRACT_CONFIG.RPC_URL);
    this.contract = new ethers.Contract(CONTRACT_CONFIG.CONTRACT_ADDRESS, UNSTABLE_COIN_ABI, this.provider);
  }

  private formatTokenAmount(amount: bigint): string {
    return ethers.formatUnits(amount, 18);
  }

  async getStats(): Promise<ContractStats> {
    // Return mock data if mock mode is enabled
    if (MOCK_CONFIG.ENABLED) {
      return {
        ...MOCK_CONFIG.MOCK_STATS,
        cooldownRemaining: getTimeUntil(MOCK_CONFIG.MOCK_STATS.nextDestabilizationTime)
      };
    }

    try {
      // Get current block timestamp from blockchain for accurate time comparison
      const currentBlock = await this.provider.getBlock('latest');
      const currentBlockTime = currentBlock?.timestamp || Math.floor(Date.now() / 1000);
      
      // Get all stats in parallel
      const [holderCount, totalSupply, stats, canDestabilize, nextDestabilizationTime] = await Promise.all([
        this.contract.holderCount(),
        this.contract.totalSupply(),
        this.contract.getStats(),
        this.contract.canDestabilizeNow(),
        this.contract.getNextDestabilizationTime()
      ]);

      const [_, totalBurned, totalMinted, destabilizationCount, timeSinceLast, eliminatedCount] = stats;
      const cooldownRemaining = getTimeUntil(Number(nextDestabilizationTime));

      return {
        holderCount: Number(holderCount),
        totalSupply: this.formatTokenAmount(totalSupply),
        totalBurned: this.formatTokenAmount(totalBurned),
        totalMinted: this.formatTokenAmount(totalMinted),
        destabilizationCount: Number(destabilizationCount),
        eliminatedCount: Number(eliminatedCount),
        canDestabilizeNow: canDestabilize,
        nextDestabilizationTime: Number(nextDestabilizationTime),
        cooldownRemaining
      };
    } catch (error) {
      console.error('Error fetching contract stats:', error);
      // Return fallback data
      return {
        holderCount: 0,
        totalSupply: '0',
        totalBurned: '0',
        totalMinted: '0',
        destabilizationCount: 0,
        eliminatedCount: 0,
        canDestabilizeNow: false,
        nextDestabilizationTime: 0,
        cooldownRemaining: 0
      };
    }
  }

  // Method to update contract configuration
  updateConfig(address: string, rpcUrl: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.contract = new ethers.Contract(address, UNSTABLE_COIN_ABI, this.provider);
  }
}

// Export singleton instance
export const contractService = new ContractService(); 