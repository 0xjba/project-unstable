const { ethers } = require('ethers');

// Simple keeper script to call destabilize function
async function main() {
  try {
    // Get environment variables
    const privateKey = process.env.PRIVATE_KEY;
    const rpcUrl = process.env.RPC_URL;
    const contractAddress = process.env.CONTRACT_ADDRESS;
    
    if (!privateKey || !rpcUrl || !contractAddress) {
      throw new Error('Missing required environment variables');
    }
    
    // Setup provider and wallet
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // Simple ABI for just the destabilize function
    const abi = [
      "function destabilize() external"
    ];
    
    // Connect to contract
    const contract = new ethers.Contract(contractAddress, abi, wallet);
    
    console.log('Attempting to call destabilize function...');
    console.log(`Contract: ${contractAddress}`);
    console.log(`Wallet: ${wallet.address}`);
    
    // Call destabilize function
    const tx = await contract.destabilize();
    console.log(`Transaction hash: ${tx.hash}`);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    console.log('Destabilization successful!');
    
  } catch (error) {
    console.error('Keeper failed:', error.message);
    process.exit(1);
  }
}

main();
