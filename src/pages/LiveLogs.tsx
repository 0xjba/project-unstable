import { useState, useEffect } from 'react';
import { TerminalLayout } from '@/components/terminal/TerminalLayout';
import { PageContainer } from '@/components/terminal/PageContainer';

interface LogEntry {
  timestamp: string;
  entries: string[];
}

const LiveLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      timestamp: '2025-06-17 14:23 UTC',
      entries: [
        '> [OFFCHAIN-KEEPER:TEE] :: INIT >> ΔΔΔ loading secure channel...',
        '> CHKΣ | 1231.908ΔΔ54.50Ω... xR3',
        '> KEY LOCKED',
        '> MSG >> "...mission override initiated... awaiting delta node clearance"'
      ]
    },
    {
      timestamp: '2025-06-17 14:34 UTC',
      entries: [
        '> [CONTRACT:UNSTABLECOIN] :: DestabilizationExecuted(round: 8, holdersAffected: 58, tokensMinted: 156373, tokensBurned: 89234)',
        '> NODE-4: 87867 ⦿ ████████░░ loading',
        '> DATA/ENCRYPT :: ..4.. %complete',
        '> "loc beacon 7A ▷ pinged ~ receiving trace logs"'
      ]
    },
    {
      timestamp: '2025-06-17 14:37 UTC',
      entries: [
        '> [OFFCHAIN-KEEPER:TEE] :: relay @ channel 8.2... xXΔ',
        '> COMMS STATUS: distorted',
        '████████████████████',
        '> DECRYPT LOG: "requesting visual on suspect-41 - triangulating path..."'
      ]
    },
    {
      timestamp: '2025-06-17 14:39 UTC',
      entries: [
        '> [CONTRACT:UNSTABLECOIN] :: HolderEliminated(holder: 0x742d35cc6e1e8e3e8e8e8e8e8e8e8e8e8e8e8e8e, tokensBurned: 1250)',
        '> attempting firewall reroute ::: [ACCESS CODE 4657.. - Σ#]',
        '> backup relay :: standby channel ∂-8 activated'
      ]
    },
    {
      timestamp: '2025-06-17 14:42 UTC',
      entries: [
        '> [OFFCHAIN-KEEPER:TEE] :: DESTABILIZATION SEQUENCE INITIATED',
        '> TARGET NODES: 3-7-12-19-24',
        '> FLUX PARAMETERS: Δ=0.847, Ω=1.234, Σ=2.156',
        '> "executing phase one... quantum flux destabilization active"'
      ]
    },
    {
      timestamp: '2025-06-17 14:45 UTC',
      entries: [
        '> [CONTRACT:UNSTABLECOIN] :: TokensMinted(to: 0x742d35cc6e1e8e3e8e8e8e8e8e8e8e8e8e8e8e8e, amount: 156373)',
        '> HOLDER AFFECTED: 1,247 → 1,189 (-58 eliminated)',
        '> SUPPLY FLUX: +156,373 tokens minted, -89,234 tokens burned',
        '> NODE STATUS: ████████████████████ 100%'
      ]
    }
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toISOString().slice(0, 19).replace('T', ' ') + ' UTC';
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
            <span className="text-foreground text-xl font-normal tracking-wide">LIVE DESTABILIZATION LOG</span>
          </div>
          
          <div className="text-sm text-muted-foreground font-normal">
            <p>Live monitoring of destabilization sequences and agent communications.</p>
            <p className="mt-2">Current time: {formatTime(currentTime)}</p>
          </div>
        </div>

        {/* Wireframe Sphere */}
        <div className="bg-card border border-border p-6 font-mono relative">
          {/* Corner plus signs */}
          <div className="absolute top-0 left-0 text-foreground text-base transform -translate-x-1/2 -translate-y-1/2">+</div>
          <div className="absolute top-0 right-0 text-foreground text-base transform translate-x-1/2 -translate-y-1/2">+</div>
          <div className="absolute bottom-0 left-0 text-foreground text-base transform -translate-x-1/2 translate-y-1/2">+</div>
          <div className="absolute bottom-0 right-0 text-foreground text-base transform translate-x-1/2 translate-y-1/2">+</div>
          
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32">
              {/* Simplified wireframe sphere using CSS */}
              <div className="absolute inset-0 border border-foreground rounded-full opacity-30"></div>
              <div className="absolute inset-2 border border-foreground rounded-full opacity-20"></div>
              <div className="absolute inset-4 border border-foreground rounded-full opacity-10"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-foreground text-xs font-mono">GLOBAL NODE</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Logs */}
        <div className="bg-card border border-border p-6 font-mono relative">
          {/* Corner plus signs */}
          <div className="absolute top-0 left-0 text-foreground text-base transform -translate-x-1/2 -translate-y-1/2">+</div>
          <div className="absolute top-0 right-0 text-foreground text-base transform translate-x-1/2 -translate-y-1/2">+</div>
          <div className="absolute bottom-0 left-0 text-foreground text-base transform -translate-x-1/2 translate-y-1/2">+</div>
          <div className="absolute bottom-0 right-0 text-foreground text-base transform translate-x-1/2 translate-y-1/2">+</div>
          
          <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
            <span className="text-foreground text-lg font-normal tracking-wide">STREAMING EVENTS LOGS</span>
            <div className="flex items-center gap-2">
              <span className="text-green-500 animate-pulse">●</span>
              <span className="text-foreground text-sm">LIVE</span>
            </div>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="space-y-2">
                <div className="text-foreground font-mono text-sm">
                  # {log.timestamp}
                </div>
                {log.entries.map((entry, entryIndex) => (
                  <div key={entryIndex} className="text-foreground font-mono text-sm ml-4">
                    {entry}
                  </div>
                ))}
              </div>
            ))}
            
            {/* Live indicator */}
            <div className="text-foreground font-mono text-sm ml-4">
              {'>'} [SYSTEM] :: AWAITING NEXT DESTABILIZATION SEQUENCE...
            </div>
          </div>
        </div>

        {/* Status Footer */}
        <div className="bg-secondary border border-border p-4 font-mono">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm">
            <div className="flex flex-wrap items-center gap-6">
              <span className="text-muted-foreground font-normal">STATUS: <span className="text-foreground font-normal">MONITORING</span></span>
              <span className="text-muted-foreground font-normal">AGENTS: <span className="text-foreground font-normal">3 ACTIVE</span></span>
              <span className="text-muted-foreground font-normal">NODES: <span className="text-foreground font-normal">24 ONLINE</span></span>
            </div>
            <span className="text-muted-foreground font-normal">
              LAST UPDATE: <span className="text-foreground font-normal">{formatTime(currentTime)}</span>
            </span>
          </div>
        </div>
      </PageContainer>
    </TerminalLayout>
  );
};

export default LiveLogs; 