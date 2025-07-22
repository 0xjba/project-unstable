import { useState, useEffect } from 'react';

interface TerminalHeaderProps {
  codename: string;
  status: 'ACTIVE' | 'COOLING_DOWN';
  nextDestabilizationETA: number; // seconds
  contractAddress: string;
  chainId: string;
}

export const TerminalHeader = ({ 
  codename, 
  status, 
  nextDestabilizationETA, 
  contractAddress, 
  chainId 
}: TerminalHeaderProps) => {
  const [timeLeft, setTimeLeft] = useState(nextDestabilizationETA);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const statusIcon = status === 'ACTIVE' ? '[!]' : '[~]';

  return (
    <div className="bg-card border border-terminal-grid p-4 font-mono">
      {/* Top row - Project info */}
      <div className="flex items-center justify-between mb-3 border-b border-terminal-grid pb-3">
        <div className="flex items-center gap-4">
          <span className="text-foreground text-lg font-semibold">
            {codename}
          </span>
          <div className="h-4 w-px bg-terminal-grid" />
          <span className="text-terminal-bright font-medium">
            {statusIcon} {status.replace('_', ' ')}
          </span>
        </div>
        
        <div className="flex items-center gap-6 text-sm">
          <div className="text-muted-foreground">
            CHAIN: <span className="text-foreground">{chainId}</span>
          </div>
          <div className="text-muted-foreground">
            CONTRACT: <span className="text-foreground font-mono text-xs">{contractAddress}</span>
          </div>
        </div>
      </div>

      {/* Bottom row - Countdown */}
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground">
          NEXT DESTABILIZATION ETA:
        </div>
        <div className="text-terminal-bright text-xl font-bold">
          {formatTime(timeLeft)}
        </div>
      </div>
    </div>
  );
};