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
          <span className="text-terminal-bright text-lg font-bold">[PROJECT UNSTABLE]</span>
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
                  `flex items-center gap-2 px-4 py-2 border border-terminal-grid transition-colors ${
                    isActive
                      ? 'bg-terminal-bright text-background font-semibold'
                      : 'bg-secondary text-foreground hover:bg-muted'
                  }`
                }
              >
                <Icon size={16} />
                <span className="text-sm">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};