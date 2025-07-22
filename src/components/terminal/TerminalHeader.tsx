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

  const statusIcon = status === 'ACTIVE' ? '⚠️' : '⏳';
  const statusColor = status === 'ACTIVE' ? 'text-terminal-red' : 'text-terminal-amber';

  return (
    <div className="bg-card border border-terminal-grid p-4 font-mono">
      {/* Top row - Project info */}
      <div className="flex items-center justify-between mb-3 border-b border-terminal-grid pb-3">
        <div className="flex items-center gap-4">
          <span className="text-terminal-green text-lg font-semibold">
            {codename}
          </span>
          <div className="h-4 w-px bg-terminal-grid" />
          <span className={`${statusColor} font-medium animate-pulse-glow`}>
            {statusIcon} {status.replace('_', ' ')}
          </span>
        </div>
        
        <div className="flex items-center gap-6 text-sm">
          <div className="text-terminal-cyan">
            CHAIN: <span className="text-terminal-green">{chainId}</span>
          </div>
          <div className="text-terminal-cyan">
            CONTRACT: <span className="text-terminal-green font-mono text-xs">{contractAddress}</span>
          </div>
        </div>
      </div>

      {/* Bottom row - Countdown */}
      <div className="flex items-center justify-between">
        <div className="text-terminal-amber">
          NEXT DESTABILIZATION ETA:
        </div>
        <div className="text-terminal-red text-xl font-bold animate-terminal-glow">
          {formatTime(timeLeft)}
        </div>
      </div>
    </div>
  );
};