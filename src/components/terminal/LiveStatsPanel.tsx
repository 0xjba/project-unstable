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
    { icon: '🧍‍♂️', label: 'HOLDER COUNT', value: formatNumber(holderCount), color: 'text-terminal-blue' },
    { icon: '🪙', label: 'TOTAL SUPPLY', value: formatNumber(totalSupply), color: 'text-terminal-green' },
    { icon: '🔥', label: 'TOTAL BURNED', value: formatNumber(totalBurned), color: 'text-terminal-red' },
    { icon: '🧫', label: 'TOTAL MINTED', value: formatNumber(totalMinted), color: 'text-terminal-cyan' },
    { icon: '☢️', label: 'DESTABILIZATION COUNT', value: destabilizationCount, color: 'text-terminal-amber' },
    { icon: '🕒', label: 'LAST DESTABILIZATION', value: formatTimeAgo(lastDestabilization), color: 'text-terminal-green' },
    { icon: '⏳', label: 'COOLDOWN REMAINING', value: formatCooldown(cooldownRemaining), color: 'text-terminal-red' }
  ];

  return (
    <div className="bg-card border border-terminal-grid p-4 font-mono">
      <div className="flex items-center gap-2 mb-4 border-b border-terminal-grid pb-2">
        <span className="text-terminal-green text-sm font-semibold">🔸 LIVE STATS PANEL</span>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <div key={index} className="bg-secondary border border-terminal-grid p-3 hover:bg-muted transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
            <div className={`text-lg font-bold ${item.color} animate-pulse-glow`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};