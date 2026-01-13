import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, MapPin, User, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/tracking', icon: MapPin, label: 'Tracking' },
  { path: '/history', icon: Clock, label: 'Storico' },
  { path: '/profile', icon: User, label: 'Profilo' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn('nav-item flex-1', isActive && 'active')}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
