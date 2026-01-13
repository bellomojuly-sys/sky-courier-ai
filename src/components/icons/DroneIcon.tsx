import React from 'react';
import { cn } from '@/lib/utils';

interface DroneIconProps {
  className?: string;
  animated?: boolean;
}

export function DroneIcon({ className, animated = false }: DroneIconProps) {
  return (
    <svg 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn(animated && 'animate-fly', className)}
    >
      {/* Drone Body */}
      <rect x="24" y="28" width="16" height="8" rx="2" fill="currentColor" />
      
      {/* Arms */}
      <rect x="8" y="30" width="16" height="4" rx="1" fill="currentColor" opacity="0.8" />
      <rect x="40" y="30" width="16" height="4" rx="1" fill="currentColor" opacity="0.8" />
      
      {/* Rotors */}
      <ellipse cx="12" cy="28" rx="8" ry="2" fill="currentColor" opacity="0.6" />
      <ellipse cx="52" cy="28" rx="8" ry="2" fill="currentColor" opacity="0.6" />
      
      {/* Top Rotors */}
      <ellipse cx="12" cy="24" rx="6" ry="1.5" fill="currentColor" opacity="0.4" />
      <ellipse cx="52" cy="24" rx="6" ry="1.5" fill="currentColor" opacity="0.4" />
      
      {/* Center Light */}
      <circle cx="32" cy="32" r="3" fill="currentColor" />
      
      {/* Landing Gear */}
      <rect x="26" y="36" width="2" height="6" rx="1" fill="currentColor" opacity="0.7" />
      <rect x="36" y="36" width="2" height="6" rx="1" fill="currentColor" opacity="0.7" />
      <rect x="23" y="41" width="8" height="2" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="33" y="41" width="8" height="2" rx="1" fill="currentColor" opacity="0.5" />
    </svg>
  );
}
