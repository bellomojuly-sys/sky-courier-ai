import React from 'react';
import { DroneStatus } from '@/types/drone';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: DroneStatus;
  className?: string;
}

const statusConfig: Record<DroneStatus, { label: string; className: string }> = {
  idle: { label: 'In attesa', className: 'bg-muted text-muted-foreground' },
  arriving: { label: 'In arrivo', className: 'status-arriving' },
  pickup: { label: 'In ritiro', className: 'status-pickup' },
  flying: { label: 'In volo', className: 'status-flying' },
  delivered: { label: 'Consegnato', className: 'status-delivered' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <div className={cn('status-badge', config.className, className)}>
      <span className={cn(
        'w-2 h-2 rounded-full',
        status === 'arriving' && 'bg-primary animate-pulse-soft',
        status === 'pickup' && 'bg-warning animate-pulse-soft',
        status === 'flying' && 'bg-success animate-pulse-soft',
        status === 'delivered' && 'bg-success',
        status === 'idle' && 'bg-muted-foreground'
      )} />
      {config.label}
    </div>
  );
}
