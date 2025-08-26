import { useState, useEffect } from 'react';
import { TerminalHeader } from '@/components/terminal/TerminalHeader';
import { LiveStatsPanel } from '@/components/terminal/LiveStatsPanel';
import { RealTimeChart } from '@/components/terminal/RealTimeChart';
import { TerminalLayout } from '@/components/terminal/TerminalLayout';
import { PageContainer } from '@/components/terminal/PageContainer';
import { useContractStats } from '@/hooks/useContractStats';
import { CONTRACT_CONFIG, MOCK_CONFIG } from '@/lib/config';

// Generate chart data from contract stats
const generateChartData = (stats: any) => {
  // If no real contract data (all zeros), return empty array
  const hasRealData = stats.holderCount > 0 || parseFloat(stats.totalSupply) > 0 || 
                     parseFloat(stats.totalMinted) > 0 || parseFloat(stats.totalBurned) > 0 || 
                     stats.destabilizationCount > 0;
  
  if (!hasRealData) {
    return []; // Return empty array for no data
  }
  
  const data = [];
  const rounds = Math.max(stats.destabilizationCount, 1);
  
  for (let i = 1; i <= rounds; i++) {
    // For now, distribute the total values across rounds
    // In a real implementation, you'd get historical data from events
    const roundMinted = i === rounds ? parseFloat(stats.totalMinted) / rounds : parseFloat(stats.totalMinted) / rounds * 0.8;
    const roundBurned = i === rounds ? parseFloat(stats.totalBurned) / rounds : parseFloat(stats.totalBurned) / rounds * 0.8;
    const roundSupply = parseFloat(stats.totalSupply) * (1 - (i - 1) * 0.1); // Decreasing supply over time
    const roundHolders = Math.max(1, Math.floor(stats.holderCount * (1 - (i - 1) * 0.05))); // Decreasing holders
    
    data.push({
      round: i,
      minted: Math.floor(roundMinted),
      burned: Math.floor(roundBurned),
      totalSupply: Math.floor(roundSupply),
      holdersAffected: roundHolders,
      timestamp: new Date(Date.now() - (rounds - i) * 24 * 60 * 60 * 1000).toISOString()
    });
  }
  
  return data;
};

const Dashboard = () => {
  const [chartType, setChartType] = useState<'mintBurn' | 'supply' | 'holders'>('mintBurn');
  
  // Real contract data
  const { stats, loading, error } = useContractStats(10000); // Refresh every 10 seconds

  return (
    <TerminalLayout>
      <PageContainer>
        {/* Terminal Header */}
        <TerminalHeader
          codename="stableCoin"
          status={loading ? "LOADING" : "ACTIVE"}
          nextDestabilizationETA={stats.cooldownRemaining}
          contractAddress={CONTRACT_CONFIG.CONTRACT_ADDRESS}
          chainId={CONTRACT_CONFIG.CHAIN_ID}
        />

        {/* Mock Mode Indicator */}
        {MOCK_CONFIG.ENABLED && (
          <div className="bg-yellow-500/10 border border-yellow-500 p-4 font-mono">
            <div className="text-yellow-500 text-sm">
              MOCK MODE: Displaying demo data for demonstration purposes
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && !MOCK_CONFIG.ENABLED && (
          <div className="bg-destructive/10 border border-destructive p-4 font-mono">
            <div className="text-destructive text-sm">
              ERROR: {error}
            </div>
          </div>
        )}

        {/* Live Stats */}
        <LiveStatsPanel 
          holderCount={stats.holderCount}
          totalSupply={stats.totalSupply}
          totalBurned={stats.totalBurned}
          totalMinted={stats.totalMinted}
          destabilizationCount={stats.destabilizationCount}
          eliminatedCount={stats.eliminatedCount}
          cooldownRemaining={stats.cooldownRemaining}
          loading={loading}
          hasError={!!error}
        />

        {/* Chart Controls */}
        <div className="bg-card border border-border p-6 font-mono relative">
          {/* Corner plus signs */}
          <div className="absolute top-0 left-0 text-foreground text-base transform -translate-x-1/2 -translate-y-1/2">+</div>
          <div className="absolute top-0 right-0 text-foreground text-base transform translate-x-1/2 -translate-y-1/2">+</div>
          <div className="absolute bottom-0 left-0 text-foreground text-base transform -translate-x-1/2 translate-y-1/2">+</div>
          <div className="absolute bottom-0 right-0 text-foreground text-base transform translate-x-1/2 translate-y-1/2">+</div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span className="text-foreground text-lg font-normal tracking-wide">
              [ANALYTICS]
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'mintBurn', label: 'MINT/BURN' },
                { key: 'supply', label: 'SUPPLY' },
                { key: 'holders', label: 'HOLDERS' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setChartType(key as any)}
                  className={`px-4 py-2 text-sm border transition-colors font-normal ${
                    chartType === key
                      ? 'border-foreground bg-accent text-accent-foreground'
                      : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart */}
        <RealTimeChart data={generateChartData(stats)} chartType={chartType} />

        {/* Status Footer */}
        <div className="bg-card border border-border p-6 font-mono">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm">
            <div className="flex flex-wrap gap-6 text-muted-foreground font-normal">
              <span>SYS: <span className={`font-normal ${(error && !MOCK_CONFIG.ENABLED) || (!MOCK_CONFIG.ENABLED && stats.holderCount === 0 && parseFloat(stats.totalSupply) === 0 && parseFloat(stats.totalMinted) === 0 && parseFloat(stats.totalBurned) === 0 && stats.destabilizationCount === 0) ? 'text-destructive' : 'text-foreground'}`}>
                {(error && !MOCK_CONFIG.ENABLED) || (!MOCK_CONFIG.ENABLED && stats.holderCount === 0 && parseFloat(stats.totalSupply) === 0 && parseFloat(stats.totalMinted) === 0 && parseFloat(stats.totalBurned) === 0 && stats.destabilizationCount === 0) ? 'DOWN' : 'OPERATIONAL'}
              </span></span>
              <span>CHAIN: <span className="text-foreground font-normal">TEN</span></span>
              <span>UPD: <span className="text-foreground font-normal">{new Date().toLocaleTimeString()}</span></span>
              <span>CONTRACT: <span className="text-foreground font-normal">{CONTRACT_CONFIG.CONTRACT_ADDRESS}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`${(error && !MOCK_CONFIG.ENABLED) || (!MOCK_CONFIG.ENABLED && stats.holderCount === 0 && parseFloat(stats.totalSupply) === 0 && parseFloat(stats.totalMinted) === 0 && parseFloat(stats.totalBurned) === 0 && stats.destabilizationCount === 0) ? 'text-yellow-500 animate-pulse drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 'text-green-500 animate-pulse drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]'}`}>●</span>
              <span className="text-foreground font-normal">
                {(error && !MOCK_CONFIG.ENABLED) || (!MOCK_CONFIG.ENABLED && stats.holderCount === 0 && parseFloat(stats.totalSupply) === 0 && parseFloat(stats.totalMinted) === 0 && parseFloat(stats.totalBurned) === 0 && stats.destabilizationCount === 0) ? 'MAINTENANCE' : 'LIVE'}
              </span>
            </div>
          </div>
        </div>
      </PageContainer>
    </TerminalLayout>
  );
};

export default Dashboard;