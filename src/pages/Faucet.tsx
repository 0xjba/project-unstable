import { TerminalLayout } from '@/components/terminal/TerminalLayout';
import { TopNavbar } from '@/components/terminal/TopNavbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Copy, ExternalLink } from 'lucide-react';

const Faucet = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [lastRequest, setLastRequest] = useState<Date | null>(null);

  const handleRequestTokens = async () => {
    if (!walletAddress) return;
    
    setIsRequesting(true);
    // Simulate API call
    setTimeout(() => {
      setIsRequesting(false);
      setLastRequest(new Date());
    }, 2000);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <TerminalLayout>
      <TopNavbar />
      
      <div className="mt-8 space-y-6">
        {/* Header */}
        <div className="bg-card border border-terminal-grid p-4 font-mono">
          <div className="flex items-center justify-between mb-4 border-b border-terminal-grid pb-2">
            <span className="text-foreground text-sm font-semibold">[FAUCET] UNSTABLECOIN TESTNET</span>
            <div className="flex gap-2 text-xs">
              <span className="text-muted-foreground">TESTNET</span>
              <span className="text-terminal-bright">●</span>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Request testnet UnstableCoin tokens for development and testing purposes.</p>
            <p className="mt-2">Rate limit: 1 request per hour per address</p>
          </div>
        </div>

        {/* Request Form */}
        <div className="bg-card border border-terminal-grid p-6 font-mono">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                [WALLET] Enter your testnet wallet address:
              </label>
              <Input
                type="text"
                placeholder="0x..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="bg-secondary border-terminal-grid font-mono text-sm"
                disabled={isRequesting}
              />
            </div>

            <Button
              onClick={handleRequestTokens}
              disabled={!walletAddress || isRequesting}
              className="w-full bg-terminal-bright text-background hover:bg-terminal-bright/90 font-mono"
            >
              {isRequesting ? '[PROCESSING...]' : '[REQUEST 1000 USTC]'}
            </Button>

            {lastRequest && (
              <div className="mt-4 p-3 bg-secondary border border-terminal-grid">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-terminal-bright">✓</span>
                  <span className="text-foreground">Last request: {formatTimeAgo(lastRequest)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Network Info */}
        <div className="bg-card border border-terminal-grid p-4 font-mono">
          <div className="flex items-center justify-between mb-4 border-b border-terminal-grid pb-2">
            <span className="text-foreground text-sm font-semibold">[NETWORK] TESTNET CONFIGURATION</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network Name:</span>
                <span className="text-foreground">UnstableCoin Testnet</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chain ID:</span>
                <span className="text-foreground">31337</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Currency:</span>
                <span className="text-foreground">USTC</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <span className="text-muted-foreground">RPC URL:</span>
                <div className="flex items-center gap-2">
                  <span className="text-foreground text-xs">https://rpc.testnet.unstable</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Copy size={12} />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <span className="text-muted-foreground">Explorer:</span>
                <Button variant="ghost" size="sm" className="h-6 flex items-center gap-1 p-1">
                  <span className="text-xs">View</span>
                  <ExternalLink size={12} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Status Footer */}
        <div className="bg-secondary border border-terminal-grid p-3 font-mono">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-muted-foreground">STATUS: OPERATIONAL</span>
              <span className="text-muted-foreground">NETWORK: TESTNET</span>
            </div>
            <span className="text-muted-foreground">
              LAST UPDATE: {new Date().toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </TerminalLayout>
  );
};

export default Faucet;