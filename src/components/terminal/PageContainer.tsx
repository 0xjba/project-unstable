import { ReactNode } from 'react';
import { TopNavbar } from './TopNavbar';

interface PageContainerProps {
  children: ReactNode;
}

export const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <div className="mt-6">
      <div className="relative bg-transparent border border-border p-6 font-mono">
        {/* Top-left corner bracket */}
        <div className="absolute -top-px -left-px w-4 h-4 border-l-2 border-t-2 border-foreground z-10 pointer-events-none"></div>
        {/* Top-right corner bracket */}
        <div className="absolute -top-px -right-px w-4 h-4 border-r-2 border-t-2 border-foreground z-10 pointer-events-none"></div>
        {/* Bottom-left corner bracket */}
        <div className="absolute -bottom-px -left-px w-4 h-4 border-l-2 border-b-2 border-foreground z-10 pointer-events-none"></div>
        {/* Bottom-right corner bracket */}
        <div className="absolute -bottom-px -right-px w-4 h-4 border-r-2 border-b-2 border-foreground z-10 pointer-events-none"></div>

        <div className="space-y-6">
          {/* Top Navbar */}
          <TopNavbar />
          
          {/* Page Content */}
          {children}
        </div>
      </div>
    </div>
  );
}; 