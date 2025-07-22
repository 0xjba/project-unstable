import { ReactNode } from 'react';

interface TerminalLayoutProps {
  children: ReactNode;
}

export const TerminalLayout = ({ children }: TerminalLayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      {/* Terminal Border Frame */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Corner brackets */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-terminal-green" />
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-terminal-green" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-terminal-green" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-terminal-green" />
      </div>

      {/* Main Content Area */}
      <div className="p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>

      {/* Grid overlay effect */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--terminal-grid)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--terminal-grid)) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
    </div>
  );
};