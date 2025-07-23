import { NavLink } from 'react-router-dom';
import { Monitor, Droplets } from 'lucide-react';

export const TopNavbar = () => {
  const navItems = [
    { path: '/', label: 'TERMINAL', icon: Monitor },
    { path: '/faucet', label: 'FAUCET', icon: Droplets },
  ];

  return (
    <nav className="bg-card border-b border-terminal-grid p-4 font-mono">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center gap-2">
          <span className="text-terminal-bright text-sm sm:text-lg font-bold">
            <span className="hidden sm:inline">[PROJECT UNSTABLE]</span>
            <span className="sm:hidden">[PU]</span>
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 border border-foreground transition-colors ${
                    isActive
                      ? 'bg-foreground text-background font-semibold'
                      : 'bg-transparent text-foreground hover:bg-foreground/10'
                  }`
                }
              >
                <Icon size={16} />
                <span className="text-sm hidden sm:inline">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};