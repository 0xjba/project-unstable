# Keeper Service Setup

This project uses GitHub Actions as a keeper service to automatically call the `destabilize()` function every 10 minutes.

## Setup Instructions

### 1. GitHub Secrets

Add these secrets to your GitHub repository (Settings > Secrets and variables > Actions):

- `KEEPER_PRIVATE_KEY`: Private key of the wallet authorized as keeper
- `RPC_URL`: RPC endpoint URL (e.g., Infura, Alchemy)
- `CONTRACT_ADDRESS`: Deployed UnstableCoin contract address

### 2. How It Works

- **Schedule**: Runs every 10 minutes via cron (`*/10 * * * *`)
- **Manual Trigger**: Can be triggered manually via "workflow_dispatch"
- **Execution**: Checks out code, installs dependencies, runs keeper script
- **Logging**: All actions are logged in GitHub Actions history

### 3. Files

- `.github/workflows/keeper.yml` - GitHub Actions workflow
- `scripts/keeper.js` - Keeper script that calls the contract
- `package.json` - Added keeper script command

### 4. Monitoring

- Check GitHub Actions tab for execution history
- View logs for each run
- Monitor for failures and retry if needed

### 5. Security Notes

- Never commit private keys to the repository
- Use testnet keys for development
- Consider key rotation for production
- Monitor wallet balance for gas fees

## Testing

You can test the keeper manually by:
1. Going to Actions tab in GitHub
2. Selecting "UnstableCoin Keeper" workflow
3. Clicking "Run workflow" button
