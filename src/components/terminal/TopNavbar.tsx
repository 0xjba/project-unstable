import { NavLink } from 'react-router-dom';
import { Monitor, Droplets, Activity } from 'lucide-react';

export const TopNavbar = () => {
  const navItems = [
    { path: '/', label: 'TERMINAL', icon: Monitor },
    { path: '/faucet', label: 'FAUCET', icon: Droplets },
    { path: '/logs', label: 'LOGS', icon: Activity },
  ];

  return (
    <nav className="bg-card border-b border-border p-4 font-mono">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3">
          <span className="text-foreground text-xl font-normal tracking-wide">
            [PROJECT UNSTABLE]
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 border border-border transition-colors text-sm font-normal ${
                    isActive
                      ? 'bg-accent text-accent-foreground border-foreground'
                      : 'bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`
                }
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};