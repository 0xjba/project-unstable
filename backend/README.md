# Node.js Keeper Service

A standalone Node.js service that acts as a keeper for the UnstableCoin contract, automatically calling the `destabilize()` function on a schedule.

## Features

- ⏰ **Cron-based scheduling** - Configurable timing (default: every 10 minutes)
- 🔗 **Blockchain integration** - Uses ethers.js for contract interaction
- 📊 **Real-time monitoring** - Live logs and health checks
- ⚙️ **Configurable** - Environment-based configuration
- 🚀 **Production ready** - Error handling and graceful shutdown

## Installation

```bash
cd keeper-service
npm install
```

## Configuration

1. Copy `env.example` to `.env`
2. Fill in your configuration:

```bash
# Required
KEEPER_PRIVATE_KEY=your_private_key_here
RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
CONTRACT_ADDRESS=0x742d35cc6e1e8e3e8e8e8e8e8e8e8e8e8e8e8e8e

# Optional
CRON_SCHEDULE=*/10 * * * *  # Every 10 minutes
GAS_LIMIT=500000
MAX_PRIORITY_FEE=2000000000
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Test
```bash
npm test
```

## Deployment Options

### 1. Local Machine
```bash
npm start
# Keep terminal open or use screen/tmux
```

### 2. VPS/Cloud Server
```bash
# Install PM2 for process management
npm install -g pm2
pm2 start index.js --name "unstable-keeper"
pm2 startup
pm2 save
```

### 3. Docker
```bash
docker build -t unstable-keeper .
docker run -d --env-file .env unstable-keeper
```

### 4. Cloud Platforms
- **Railway**: `railway up`
- **Render**: Deploy as web service
- **Heroku**: Deploy as worker dyno

## Monitoring

- **Health checks** every minute
- **Transaction logs** for each destabilization
- **Error handling** with detailed logging
- **Gas monitoring** and estimation

## Security Notes

- Never commit `.env` files
- Use testnet keys for development
- Monitor wallet balance for gas fees
- Consider key rotation for production

## Troubleshooting

### Common Issues

1. **"Missing environment variables"**
   - Check your `.env` file
   - Ensure all required variables are set

2. **"Insufficient funds"**
   - Add ETH to keeper wallet for gas fees
   - Check gas price settings

3. **"Not authorized keeper"**
   - Ensure wallet address is authorized in contract
   - Check contract permissions

### Logs

The service provides detailed logging:
- Startup information
- Health check messages
- Transaction details
- Error messages with context
