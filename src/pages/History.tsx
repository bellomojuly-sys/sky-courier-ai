import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { DroneIcon } from '@/components/icons/DroneIcon';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MapPin, Calendar, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

export default function History() {
  const { user } = useUser();
  const deliveries = user?.deliveryHistory || [];

  return (
    <AppLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Storico Consegne</h1>
          <p className="text-muted-foreground">Le tue ultime spedizioni</p>
        </div>

        {deliveries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <DroneIcon className="w-20 h-20 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nessuna consegna
            </h3>
            <p className="text-muted-foreground">
              Le tue consegne appariranno qui
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {deliveries.map((delivery) => (
              <div 
                key={delivery.id}
                className="glass-card p-4 space-y-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(delivery.createdAt), "d MMMM yyyy, HH:mm", { locale: it })}
                  </div>
                  <StatusBadge status={delivery.status} />
                </div>

                {/* Locations */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm text-foreground truncate">
                      {delivery.pickupLocation.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-sm text-foreground truncate">
                      {delivery.deliveryLocation.address}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-2">
                    <DroneIcon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {delivery.droneId || 'DRN-001'}
                    </span>
                  </div>
                  <button className="text-primary text-sm font-medium flex items-center gap-1">
                    Dettagli
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
