import { TerminalLayout } from '@/components/terminal/TerminalLayout';
import { PageContainer } from '@/components/terminal/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Copy, ExternalLink } from 'lucide-react';
import { faucetContractService } from '@/lib/faucetContract';

const Faucet = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [canClaim, setCanClaim] = useState(true); // Default to true, will be checked on claim
  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState(0);
  const [lastRequest, setLastRequest] = useState<Date | null>(null);
  const [logEntries, setLogEntries] = useState<string[]>([]);

  const handleClaim = async () => {
    if (!walletAddress) return;
    
    setIsClaiming(true);
    try {
      // Check if can claim first
      const canClaimStatus = await faucetContractService.canClaim(walletAddress);
      
      if (!canClaimStatus) {
        const timeRemaining = await faucetContractService.timeUntilNextClaim(walletAddress);
        setTimeUntilNextClaim(timeRemaining);
        setCanClaim(false);
        addLogEntry(`> [FAUCET:COOLDOWN] :: Time remaining: ${formatTimeAgo(new Date(Date.now() + timeRemaining * 1000))}`);
        return;
      }
      
      await faucetContractService.claim(walletAddress);
      setLastRequest(new Date());
      setCanClaim(false);
      addLogEntry(`> [FAUCET:CLAIM] :: Tokens claimed successfully`);
    } catch (error) {
      console.error('Error claiming:', error);
      addLogEntry(`> [FAUCET:ERROR] :: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsClaiming(false);
    }
  };

  const addLogEntry = (entry: string) => {
    const timestamp = new Date().toLocaleString();
    setLogEntries(prev => [`# ${timestamp}`, entry, ...prev.slice(0, 8)]); // Keep last 10 entries
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
      <PageContainer>
        {/* Header */}
        <div className="bg-card border border-border p-6 font-mono relative">
          {/* Corner plus signs */}
          <div className="absolute top-0 left-0 text-foreground text-base transform -translate-x-1/2 -translate-y-1/2">+</div>
          <div className="absolute top-0 right-0 text-foreground text-base transform translate-x-1/2 -translate-y-1/2">+</div>
          <div className="absolute bottom-0 left-0 text-foreground text-base transform -translate-x-1/2 translate-y-1/2">+</div>
          <div className="absolute bottom-0 right-0 text-foreground text-base transform translate-x-1/2 translate-y-1/2">+</div>
          
          <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
            <span className="text-foreground text-lg font-normal tracking-wide">FAUCET OPERATION</span>
            <div className="flex gap-2 text-xs font-normal">
              <span className="text-muted-foreground">TESTNET</span>
              <span className="text-foreground">●</span>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground font-normal">
            <p>Request testnet UnstableCoin tokens for development and testing purposes.</p>
            <p className="mt-2">Rate limit: 1 request per hour per address</p>
          </div>
        </div>

        {/* Request Form */}
        <div className="bg-card border border-border p-6 font-mono relative">
          {/* Corner plus signs */}
          <div className="absolute top-0 left-0 text-foreground text-base transform -translate-x-1/2 -translate-y-1/2">+</div>
          <div className="absolute top-0 right-0 text-foreground text-base transform translate-x-1/2 -translate-y-1/2">+</div>
          <div className="absolute bottom-0 left-0 text-foreground text-base transform -translate-x-1/2 translate-y-1/2">+</div>
          <div className="absolute bottom-0 right-0 text-foreground text-base transform translate-x-1/2 translate-y-1/2">+</div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-normal text-foreground mb-2">
                WALLET ADDRESS:
              </label>
              <Input
                type="text"
                placeholder="0x..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="bg-secondary border-border font-mono text-sm"
                disabled={isClaiming}
              />
            </div>

            <Button
              onClick={handleClaim}
              disabled={!walletAddress || isClaiming || !canClaim}
              className="w-full bg-foreground text-background hover:bg-foreground/90 font-normal"
            >
              {isClaiming ? 'PROCESSING...' : canClaim ? 'CLAIM TOKENS' : 'COOLDOWN ACTIVE'}
            </Button>

            {!canClaim && timeUntilNextClaim > 0 && (
              <div className="mt-4 p-4 bg-secondary border border-border">
                <div className="flex items-center gap-2 text-sm font-normal">
                  <span className="text-foreground">●</span>
                  <span className="text-foreground">Time until next claim: {formatTimeAgo(new Date(Date.now() + timeUntilNextClaim * 1000))}</span>
                </div>
              </div>
            )}


          </div>
        </div>

        {/* Faucet Logs */}
        <div className="bg-card border border-border p-6 font-mono relative">
          {/* Corner plus signs */}
          <div className="absolute top-0 left-0 text-foreground text-base transform -translate-x-1/2 -translate-y-1/2">+</div>
          <div className="absolute top-0 right-0 text-foreground text-base transform translate-x-1/2 -translate-y-1/2">+</div>
          <div className="absolute bottom-0 left-0 text-foreground text-base transform -translate-x-1/2 translate-y-1/2">+</div>
          <div className="absolute bottom-0 right-0 text-foreground text-base transform translate-x-1/2 translate-y-1/2">+</div>
          
          <div className="bg-background border border-border p-4 h-8 overflow-y-auto font-mono text-xs">
            {logEntries.length === 0 ? (
              <div className="text-muted-foreground flex items-center h-full">Faucet Logs</div>
            ) : (
              <div className="space-y-1">
                {logEntries.map((entry, index) => (
                  <div key={index} className="text-foreground font-normal">
                    {entry}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Network Info */}
        <div className="bg-card border border-border p-6 font-mono relative">
          {/* Corner plus signs */}
          <div className="absolute top-0 left-0 text-foreground text-base transform -translate-x-1/2 -translate-y-1/2">+</div>
          <div className="absolute top-0 right-0 text-foreground text-base transform translate-x-1/2 -translate-y-1/2">+</div>
          <div className="absolute bottom-0 left-0 text-foreground text-base transform -translate-x-1/2 translate-y-1/2">+</div>
          <div className="absolute bottom-0 right-0 text-foreground text-base transform translate-x-1/2 translate-y-1/2">+</div>
          
          <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
            <span className="text-foreground text-lg font-normal tracking-wide">NETWORK CONFIGURATION</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <div className="flex justify-between font-normal">
                <span className="text-muted-foreground">Network Name:</span>
                <span className="text-foreground font-normal">TEN Testnet</span>
              </div>
              <div className="flex justify-between font-normal">
                <span className="text-muted-foreground">Chain ID:</span>
                <span className="text-foreground font-normal">443</span>
              </div>
              <div className="flex justify-between font-normal">
                <span className="text-muted-foreground">Currency:</span>
                <span className="text-foreground font-normal">UNSTBL</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <span className="text-muted-foreground font-normal">RPC URL:</span>
                <div className="flex items-center gap-2">
                  <span className="text-foreground text-xs font-mono">https://testnet.ten.xyz</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Copy size={12} />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <span className="text-muted-foreground font-normal">Explorer:</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 flex items-center gap-1 p-1"
                  onClick={() => window.open('https://tenscan.io', '_blank')}
                >
                  <span className="text-xs font-normal">View</span>
                  <ExternalLink size={12} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Status Footer */}
        <div className="bg-secondary border border-border p-4 font-mono">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm">
            <div className="flex flex-wrap items-center gap-6">
              <span className="text-muted-foreground font-normal">STATUS: <span className="text-foreground font-normal">OPERATIONAL</span></span>
              <span className="text-muted-foreground font-normal">NETWORK: <span className="text-foreground font-normal">TESTNET</span></span>
            </div>
            <span className="text-muted-foreground font-normal">
              LAST UPDATE: <span className="text-foreground font-normal">{new Date().toLocaleString()}</span>
            </span>
          </div>
        </div>
      </PageContainer>
    </TerminalLayout>
  );
};

export default Faucet;