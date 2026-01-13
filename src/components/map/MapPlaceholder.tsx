import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { DroneIcon } from '@/components/icons/DroneIcon';
import { DroneStatus } from '@/types/drone';
import { cn } from '@/lib/utils';

interface MapPlaceholderProps {
  showDrone?: boolean;
  droneStatus?: DroneStatus;
  pickupLocation?: string;
  deliveryLocation?: string;
  className?: string;
}

export function MapPlaceholder({ 
  showDrone = false, 
  droneStatus = 'idle',
  pickupLocation,
  deliveryLocation,
  className 
}: MapPlaceholderProps) {
  return (
    <div className={cn(
      'relative bg-gradient-to-br from-secondary via-secondary/80 to-accent rounded-2xl overflow-hidden',
      className
    )}>
      {/* Map Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Mock Streets */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 right-0 h-1 bg-muted-foreground/20" />
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-muted-foreground/30" />
        <div className="absolute top-3/4 left-0 right-0 h-1 bg-muted-foreground/20" />
        <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-muted-foreground/20" />
        <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-muted-foreground/30" />
        <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-muted-foreground/20" />
      </div>

      {/* Pickup Marker */}
      {pickupLocation && (
        <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="map-marker animate-pulse-soft" />
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <div className="bg-card px-3 py-1 rounded-lg shadow-md text-xs font-medium">
                Ritiro
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Marker */}
      {deliveryLocation && (
        <div className="absolute bottom-1/3 right-1/4 transform translate-x-1/2 translate-y-1/2">
          <div className="relative">
            <div className="w-4 h-4 rounded-full bg-success">
              <div className="absolute inset-0 bg-success rounded-full animate-ping opacity-50" />
            </div>
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <div className="bg-card px-3 py-1 rounded-lg shadow-md text-xs font-medium">
                Consegna
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drone */}
      {showDrone && (
        <div className={cn(
          'absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000',
          droneStatus === 'arriving' && 'top-1/2 left-1/2',
          droneStatus === 'pickup' && 'top-1/3 left-1/4',
          droneStatus === 'flying' && 'bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2',
          droneStatus === 'delivered' && 'bottom-1/4 right-1/4'
        )}>
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl scale-150 animate-pulse-soft" />
            <DroneIcon className="w-12 h-12 text-primary relative z-10" animated />
          </div>
        </div>
      )}

      {/* Route Line */}
      {pickupLocation && deliveryLocation && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(142 76% 36%)" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <path
            d="M 25% 33% Q 50% 20% 75% 67%"
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="3"
            strokeDasharray="8 4"
            className="animate-pulse-soft"
          />
        </svg>
      )}

      {/* Center Button */}
      <button className="absolute bottom-4 right-4 w-10 h-10 bg-card rounded-xl shadow-lg flex items-center justify-center">
        <Navigation className="w-5 h-5 text-primary" />
      </button>
    </div>
  );
}
