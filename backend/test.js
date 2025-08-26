require('dotenv').config();
const { ethers } = require('ethers');

async function testConnection() {
  try {
    console.log('Testing Keeper Service Configuration...\n');
    
    // Check environment variables
    const required = ['KEEPER_PRIVATE_KEY', 'RPC_URL', 'CONTRACT_ADDRESS'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.error('Missing environment variables:', missing.join(', '));
      console.log('Copy env.example to .env and fill in your values');
      return;
    }
    
    console.log('Environment variables loaded');
    
    // Test blockchain connection
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const network = await provider.getNetwork();
    console.log(`Connected to network: ${network.name} (Chain ID: ${network.chainId})`);
    
    // Test wallet setup
    const wallet = new ethers.Wallet(process.env.KEEPER_PRIVATE_KEY, provider);
    console.log(`Wallet address: ${wallet.address}`);
    
    // Check wallet balance
    const balance = await provider.getBalance(wallet.address);
    console.log(`Wallet balance: ${ethers.formatEther(balance)} ETH`);
    
    // Test contract connection
    const contractABI = ["function destabilize() external"];
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, provider);
    console.log(`Contract address: ${process.env.CONTRACT_ADDRESS}`);
    
    // Test gas estimation (read-only, won't execute)
    try {
      const gasEstimate = await contract.destabilize.estimateGas();
      console.log(`Gas estimation successful: ${gasEstimate.toString()} gas`);
    } catch (error) {
      console.log(`Gas estimation failed: ${error.message}`);
      console.log('This might be normal if the contract has restrictions');
    }
    
    console.log('\nConfiguration test completed successfully!');
    console.log('You can now run: npm start');
    
  } catch (error) {
    console.error('Test failed:', error.message);
    console.log('\nCommon fixes:');
    console.log('- Check your RPC URL is correct');
    console.log('- Ensure your private key is valid');
    console.log('- Verify contract address is deployed');
    console.log('- Check network connectivity');
  }
}

testConnection();
