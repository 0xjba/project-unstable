import { useState, useEffect } from 'react';
import { formatTimeDifference } from '@/lib/timeUtils';

interface LiveStatsPanelProps {
  holderCount: number;
  totalSupply: string;
  totalBurned: string;
  totalMinted: string;
  destabilizationCount: number;
  eliminatedCount: number;
  cooldownRemaining: number; // seconds
  loading?: boolean;
  hasError?: boolean;
}

// Slot machine style rolling digit
const SlotRollingDigit = ({
  target,
  isLoaded,
  isError,
  speed = 20,
}: {
  target: string;
  isLoaded: boolean;
  isError: boolean;
  speed?: number;
}) => {
  const [currentDigit, setCurrentDigit] = useState('0');
  useEffect(() => {
    if (isLoaded && !isError) {
      setCurrentDigit(target);
      return;
    }
    let active = true;
    const roll = () => {
      if (!active) return;
      setCurrentDigit(Math.floor(Math.random() * 10).toString());
      setTimeout(roll, speed);
    };
    roll();
    return () => {
      active = false;
    };
  }, [target, isLoaded, isError, speed]);

  return (
    <span style={{ display: 'inline-block', transition: 'transform 0.1s', minWidth: '1ch' }}>{currentDigit}</span>
  );
};

// Slot machine style rolling number
const SlotRollingNumber = ({
  value,
  isLoaded,
  isError,
  format = (val: number) => val.toString(),
}: {
  value: number;
  isLoaded: boolean;
  isError: boolean;
  format?: (val: number) => string;
}) => {
  // Format the value for display (e.g., with commas)
  const formatted = format(value);
  // Split into array of chars (digits, commas, dots)
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      {formatted.split('').map((char, idx) =>
        /[0-9]/.test(char) ? (
          <SlotRollingDigit key={idx} target={char} isLoaded={isLoaded} isError={isError} />
        ) : (
          <span key={idx}>{char}</span>
        )
      )}
    </span>
  );
};

export const LiveStatsPanel = ({
  holderCount,
  totalSupply,
  totalBurned,
  totalMinted,
  destabilizationCount,
  eliminatedCount,
  cooldownRemaining,
  loading = false,
  hasError = false
}: LiveStatsPanelProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only consider it loaded if we're not loading AND we have real data (not just 0s)
    const hasRealData = holderCount > 0 || parseFloat(totalSupply) > 0 || parseFloat(totalMinted) > 0 || parseFloat(totalBurned) > 0 || destabilizationCount > 0;
    if (!loading && hasRealData) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
  }, [loading, holderCount, totalSupply, totalMinted, totalBurned, destabilizationCount]);

  const formatTokenAmount = (amount: string) => {
    const num = parseFloat(amount);
    return num.toLocaleString(undefined, { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 2 
    });
  };

  const statItems = [
    { 
      label: 'HOLDERS/SURVIVORS', 
      value: holderCount,
      format: (val: number) => val.toLocaleString(),
      isNumber: true
    },
    { 
      label: 'ELIMINATED', 
      value: eliminatedCount,
      format: (val: number) => val.toLocaleString(),
      isNumber: true
    },
    { 
      label: 'TOTAL SUPPLY', 
      value: parseFloat(totalSupply) || 0,
      format: (val: number) => formatTokenAmount(val.toString()),
      isNumber: true
    },
    { 
      label: 'TOTAL MINTED', 
      value: parseFloat(totalMinted) || 0,
      format: (val: number) => formatTokenAmount(val.toString()),
      isNumber: true
    },
    { 
      label: 'TOTAL BURNT', 
      value: parseFloat(totalBurned) || 0,
      format: (val: number) => formatTokenAmount(val.toString()),
      isNumber: true
    },
    { 
      label: 'DESTABILIZATION COUNT', 
      value: destabilizationCount,
      format: (val: number) => val.toString(),
      isNumber: true
    }
  ];

  return (
    <div className="bg-card border border-border p-6 font-mono relative">
            {/* Corner plus signs */}
      <div className="absolute top-0 left-0 text-foreground text-base transform -translate-x-1/2 -translate-y-1/2">+</div>
      <div className="absolute top-0 right-0 text-foreground text-base transform translate-x-1/2 -translate-y-1/2">+</div>
      <div className="absolute bottom-0 left-0 text-foreground text-base transform -translate-x-1/2 translate-y-1/2">+</div>
      <div className="absolute bottom-0 right-0 text-foreground text-base transform translate-x-1/2 translate-y-1/2">+</div>
      
      <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
        <span className="text-foreground text-lg font-normal tracking-wide">[LIVE STATS]</span>
        {loading && (
          <span className="text-muted-foreground text-sm">LOADING...</span>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statItems.map((item, index) => (
          <div key={index} className="bg-secondary border border-border p-4 hover:bg-accent transition-colors relative">
            {/* Corner plus signs for individual stat boxes */}
            <div className="absolute top-0 left-0 text-foreground text-[10px] transform -translate-x-1/2 -translate-y-1/2">+</div>
            <div className="absolute top-0 right-0 text-foreground text-[10px] transform translate-x-1/2 -translate-y-1/2">+</div>
            <div className="absolute bottom-0 left-0 text-foreground text-[10px] transform -translate-x-1/2 translate-y-1/2">+</div>
            <div className="absolute bottom-0 right-0 text-foreground text-[10px] transform translate-x-1/2 translate-y-1/2">+</div>
            
            <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-normal">
              {item.label}
            </div>
            <div className="text-2xl font-normal text-foreground terminal-text">
              {item.isNumber ? (
                <SlotRollingNumber
                  value={item.value}
                  isLoaded={isLoaded}
                  isError={hasError}
                  format={item.format}
                />
              ) : (
                item.format(item.value)
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};