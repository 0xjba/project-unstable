// Contract configuration
export const CONTRACT_CONFIG = {
  // Contract address - can be set via environment variable or default
  CONTRACT_ADDRESS: import.meta.env.VITE_CONTRACT_ADDRESS || '0x742d35cc6e1e8e3e8e8e8e8e8e8e8e8e8e8e8e8e',
  
  // RPC URL - can be set via environment variable or default
  RPC_URL: import.meta.env.VITE_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_PROJECT_ID',
  
  // Network configuration
  CHAIN_ID: 'Sepolia (11155111)',
  
  // Refresh intervals (in milliseconds)
  STATS_REFRESH_INTERVAL: 10000, // 10 seconds
  COOLDOWN_UPDATE_INTERVAL: 1000, // 1 second
};

// Mock mode configuration
export const MOCK_CONFIG = {
  // Enable mock mode via environment variable
  ENABLED: import.meta.env.VITE_MOCK_MODE === 'true',
  
  // Mock data for demonstration
  MOCK_STATS: {
    holderCount: 1247,
    totalSupply: '943627.45',
    totalBurned: '156373.23',
    totalMinted: '1100000.00',
    destabilizationCount: 8,
    eliminatedCount: 58,
    canDestabilizeNow: true,
    nextDestabilizationTime: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    cooldownRemaining: 3600
  }
};

// Update these values with your actual contract deployment
export const updateContractConfig = (address: string, rpcUrl: string) => {
  CONTRACT_CONFIG.CONTRACT_ADDRESS = address;
  CONTRACT_CONFIG.RPC_URL = rpcUrl;
}; 