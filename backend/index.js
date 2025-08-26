require('dotenv').config();
const cron = require('node-cron');
const { ethers } = require('ethers');

// Configuration
const config = {
  privateKey: process.env.KEEPER_PRIVATE_KEY,
  rpcUrl: process.env.RPC_URL,
  contractAddress: process.env.CONTRACT_ADDRESS,
  cronSchedule: process.env.CRON_SCHEDULE || '*/10 * * * *', // Every 10 minutes
  gasLimit: process.env.GAS_LIMIT || 500000,
  maxPriorityFeePerGas: process.env.MAX_PRIORITY_FEE || '2000000000', // 2 gwei
};

// Validate configuration
function validateConfig() {
  const required = ['privateKey', 'rpcUrl', 'contractAddress'];
  const missing = required.filter(key => !config[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Setup provider and wallet
function setupBlockchain() {
  const provider = new ethers.JsonRpcProvider(config.rpcUrl);
  const wallet = new ethers.Wallet(config.privateKey, provider);
  
  return { provider, wallet };
}

// Contract ABI for destabilize function
const contractABI = [
  "function destabilize() external"
];

// Execute destabilization
async function executeDestabilization() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Starting destabilization attempt...`);
  
  try {
    const { provider, wallet } = setupBlockchain();
    const contract = new ethers.Contract(config.contractAddress, contractABI, wallet);
    
    // Check wallet balance for gas
    const balance = await provider.getBalance(wallet.address);
    const gasPrice = await provider.getFeeData();
    
    console.log(`Wallet: ${wallet.address}`);
    console.log(`Balance: ${ethers.formatEther(balance)} ETH`);
    console.log(`Gas Price: ${ethers.formatUnits(gasPrice.gasPrice, 'gwei')} gwei`);
    
    // Estimate gas
    const gasEstimate = await contract.destabilize.estimateGas();
    console.log(`Estimated gas: ${gasEstimate.toString()}`);
    
    // Execute transaction
    const tx = await contract.destabilize({
      gasLimit: config.gasLimit,
      maxPriorityFeePerGas: config.maxPriorityFeePerGas
    });
    
    console.log(`Transaction sent: ${tx.hash}`);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);
    console.log(`[${timestamp}] Destabilization successful!`);
    
    return { success: true, txHash: tx.hash, gasUsed: receipt.gasUsed.toString() };
    
  } catch (error) {
    console.error(`[${timestamp}] Destabilization failed:`, error.message);
    return { success: false, error: error.message };
  }
}

// Health check function
function healthCheck() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Keeper service is running...`);
}

// Main function
async function main() {
  try {
    console.log('🚀 Starting UnstableCoin Keeper Service...');
    validateConfig();
    
    const { provider, wallet } = setupBlockchain();
    console.log(`Connected to network: ${(await provider.getNetwork()).name}`);
    console.log(`Keeper wallet: ${wallet.address}`);
    console.log(`Contract: ${config.contractAddress}`);
    console.log(`Schedule: ${config.cronSchedule}`);
    
    // Health check every minute
    cron.schedule('* * * * *', healthCheck);
    
    // Main destabilization schedule
    cron.schedule(config.cronSchedule, async () => {
      await executeDestabilization();
    });
    
    console.log('✅ Keeper service started successfully!');
    console.log('Press Ctrl+C to stop...');
    
    // Keep the process running
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down keeper service...');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Failed to start keeper service:', error.message);
    process.exit(1);
  }
}

// Start the service
main();
