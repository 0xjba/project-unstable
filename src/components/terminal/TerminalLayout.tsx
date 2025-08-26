import { ReactNode } from 'react';

interface TerminalLayoutProps {
  children: ReactNode;
}

export const TerminalLayout = ({ children }: TerminalLayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono strikeops-scanlines">
      {/* Main Content Area */}
      <div className="p-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>

      {/* Subtle grid overlay effect */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--terminal-grid)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--terminal-grid)) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}
      />
    </div>
  );
};