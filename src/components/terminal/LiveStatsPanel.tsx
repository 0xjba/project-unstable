interface LiveStatsPanelProps {
  holderCount: number;
  totalSupply: string;
  totalBurned: string;
  totalMinted: string;
  destabilizationCount: number;
  lastDestabilization: Date;
  cooldownRemaining: number; // seconds
}

export const LiveStatsPanel = ({
  holderCount,
  totalSupply,
  totalBurned,
  totalMinted,
  destabilizationCount,
  lastDestabilization,
  cooldownRemaining
}: LiveStatsPanelProps) => {
  const formatNumber = (num: string | number) => {
    return typeof num === 'string' ? num : num.toLocaleString();
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const formatCooldown = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const statItems = [
    { label: 'HOLDER COUNT', value: formatNumber(holderCount), prefix: 'H' },
    { label: 'TOTAL SUPPLY', value: formatNumber(totalSupply), prefix: 'S' },
    { label: 'TOTAL BURNED', value: formatNumber(totalBurned), prefix: 'B' },
    { label: 'TOTAL MINTED', value: formatNumber(totalMinted), prefix: 'M' },
    { label: 'DESTABILIZATION COUNT', value: destabilizationCount, prefix: 'D' },
    { label: 'LAST DESTABILIZATION', value: formatTimeAgo(lastDestabilization), prefix: 'L' }
  ];

  return (
    <div className="bg-card border border-terminal-grid p-4 font-mono">
      <div className="flex items-center gap-2 mb-4 border-b border-terminal-grid pb-2">
        <span className="text-foreground text-sm font-semibold">[LIVE STATS]</span>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <div key={index} className="bg-secondary border border-terminal-grid p-3 hover:bg-muted transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
            <div className="text-lg font-bold text-terminal-bright">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};