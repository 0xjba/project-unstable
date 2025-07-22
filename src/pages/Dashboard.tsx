import { useState, useEffect } from 'react';
import { TerminalHeader } from '@/components/terminal/TerminalHeader';
import { LiveStatsPanel } from '@/components/terminal/LiveStatsPanel';
import { RealTimeChart } from '@/components/terminal/RealTimeChart';
import { TerminalLayout } from '@/components/terminal/TerminalLayout';

// Mock data - in real app this would come from blockchain/API
const generateMockData = () => {
  const data = [];
  for (let i = 1; i <= 10; i++) {
    data.push({
      round: i,
      minted: Math.floor(Math.random() * 10000) + 5000,
      burned: Math.floor(Math.random() * 8000) + 3000,
      totalSupply: 1000000 - (i * 5000) + Math.floor(Math.random() * 20000),
      holdersAffected: Math.floor(Math.random() * 50) + 10,
      timestamp: new Date(Date.now() - (10 - i) * 24 * 60 * 60 * 1000).toISOString()
    });
  }
  return data;
};

export const Dashboard = () => {
  const [chartType, setChartType] = useState<'mintBurn' | 'supply' | 'holders'>('mintBurn');
  const [mockData] = useState(generateMockData());
  
  // Mock real-time data
  const [liveStats, setLiveStats] = useState({
    holderCount: 1247,
    totalSupply: "943,627",
    totalBurned: "156,373",
    totalMinted: "1,100,000",
    destabilizationCount: 8,
    lastDestabilization: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    cooldownRemaining: 14523 // seconds
  });

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        holderCount: prev.holderCount + Math.floor(Math.random() * 3) - 1,
        cooldownRemaining: Math.max(0, prev.cooldownRemaining - 1)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <TerminalLayout>
      <div className="space-y-6">
        {/* Terminal Header */}
        <TerminalHeader
          codename="UnstableCoin::Testnet"
          status={liveStats.cooldownRemaining > 0 ? 'COOLING_DOWN' : 'ACTIVE'}
          nextDestabilizationETA={liveStats.cooldownRemaining}
          contractAddress="0x742d35cc6e1e8e3e8e8e8e8e8e8e8e8e8e8e8e8e"
          chainId="Sepolia (11155111)"
        />

        {/* Live Stats */}
        <LiveStatsPanel {...liveStats} />

        {/* Chart Controls */}
        <div className="bg-card border border-terminal-grid p-4 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-terminal-green text-sm font-semibold">
              📈 REAL-TIME ANALYTICS
            </span>
            <div className="flex gap-2">
              {[
                { key: 'mintBurn', label: 'MINT/BURN' },
                { key: 'supply', label: 'SUPPLY' },
                { key: 'holders', label: 'HOLDERS' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setChartType(key as any)}
                  className={`px-3 py-1 text-xs border transition-colors ${
                    chartType === key
                      ? 'border-terminal-red bg-terminal-red/10 text-terminal-red'
                      : 'border-terminal-grid text-muted-foreground hover:border-terminal-green hover:text-terminal-green'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart */}
        <RealTimeChart data={mockData} chartType={chartType} />

        {/* Status Footer */}
        <div className="bg-card border border-terminal-grid p-4 font-mono">
          <div className="flex items-center justify-between text-xs">
            <div className="flex gap-6 text-muted-foreground">
              <span>SYSTEM STATUS: <span className="text-terminal-green">OPERATIONAL</span></span>
              <span>NETWORK: <span className="text-terminal-blue">ETHEREUM SEPOLIA</span></span>
              <span>LAST UPDATE: <span className="text-terminal-amber">{new Date().toLocaleTimeString()}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-terminal-red animate-flicker">●</span>
              <span className="text-terminal-green">LIVE</span>
            </div>
          </div>
        </div>
      </div>
    </TerminalLayout>
  );
};