# Keeper Service Setup

This project provides **two options** for a keeper service to automatically call the `destabilize()` function every 10 minutes:

## **Option 1: GitHub Actions (Recommended for Starters)**
- **Cost**: FREE
- **Setup**: Simple, managed by GitHub
- **Best for**: Development, testing, small projects

## **Option 2: Node.js Service (Recommended for Production)**
- **Cost**: Varies (VPS, cloud, or free tiers)
- **Setup**: More control, customizable
- **Best for**: Production, custom logic, reliability

## Setup Instructions

### **Option 1: GitHub Actions Setup**

#### 1. GitHub Secrets

Add these secrets to your GitHub repository (Settings > Secrets and variables > Actions):

- `KEEPER_PRIVATE_KEY`: Private key of the wallet authorized as keeper
- `RPC_URL`: RPC endpoint URL (e.g., Infura, Alchemy)
- `CONTRACT_ADDRESS`: Deployed UnstableCoin contract address

#### 2. How It Works

- **Schedule**: Runs every 10 minutes via cron (`*/10 * * * *`)
- **Manual Trigger**: Can be triggered manually via "workflow_dispatch"
- **Execution**: Checks out code, installs dependencies, runs keeper script
- **Logging**: All actions are logged in GitHub Actions history

### **Option 2: Node.js Service Setup**

#### 1. Install Dependencies
```bash
cd keeper-service
npm install
```

#### 2. Environment Configuration
```bash
cp env.example .env
# Edit .env with your values
```

#### 3. Test Configuration
```bash
npm test
```

#### 4. Start Service
```bash
npm start
```

### 3. Files

#### GitHub Actions Option
- `.github/workflows/keeper.yml` - GitHub Actions workflow
- `scripts/keeper.js` - Keeper script that calls the contract
- `package.json` - Added keeper script command

#### Node.js Service Option
- `keeper-service/` - Complete standalone service
- `keeper-service/index.js` - Main service file
- `keeper-service/package.json` - Service dependencies
- `keeper-service/env.example` - Configuration template
- `keeper-service/test.js` - Configuration test script

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
