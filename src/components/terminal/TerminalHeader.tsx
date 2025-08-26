import { useState, useEffect } from 'react';
import { formatTimeDifference } from '@/lib/timeUtils';

interface TerminalHeaderProps {
  codename: string;
  status: 'ACTIVE' | 'COOLING_DOWN' | 'LOADING';
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
    return formatTimeDifference(seconds);
  };

  return (
    <div className="bg-card border border-border p-6 font-mono relative">
      {/* Corner plus signs */}
      <div className="absolute top-0 left-0 text-foreground text-base transform -translate-x-1/2 -translate-y-1/2">+</div>
      <div className="absolute top-0 right-0 text-foreground text-base transform translate-x-1/2 -translate-y-1/2">+</div>
      <div className="absolute bottom-0 left-0 text-foreground text-base transform -translate-x-1/2 translate-y-1/2">+</div>
      <div className="absolute bottom-0 right-0 text-foreground text-base transform translate-x-1/2 translate-y-1/2">+</div>
      
      {/* Top row - Project info */}
      <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
        <div className="flex items-center gap-6">
          <span className="text-foreground text-xl font-normal tracking-wide">
            [UNSTABLE COIN]
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-sm font-normal">
          <div className="text-muted-foreground">
            WORLD'S MOST UNSTABLE CRYPTOGRAPHICALLY VERIFIABLE TOKEN
          </div>
        </div>
      </div>

      {/* Bottom row - Countdown */}
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm font-normal">
          NEXT DESTABILIZATION ETA:
        </div>
        <div className="text-lg font-normal tracking-wide terminal-text">
          {formatTime(timeLeft)}
        </div>
      </div>
    </div>
  );
};