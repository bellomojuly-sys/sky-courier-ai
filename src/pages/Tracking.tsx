import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { MapPlaceholder } from '@/components/map/MapPlaceholder';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DroneIcon } from '@/components/icons/DroneIcon';
import { 
  MapPin, 
  Clock, 
  Battery, 
  CheckCircle2, 
  Package,
  ArrowRight,
  Phone
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { DroneStatus } from '@/types/drone';

const statusSteps: { status: DroneStatus; label: string; icon: React.ElementType }[] = [
  { status: 'arriving', label: 'In arrivo', icon: Package },
  { status: 'pickup', label: 'In ritiro', icon: MapPin },
  { status: 'flying', label: 'In volo', icon: DroneIcon as any },
  { status: 'delivered', label: 'Consegnato', icon: CheckCircle2 },
];

export default function Tracking() {
  const navigate = useNavigate();
  const { currentDelivery, updateDeliveryStatus, confirmPickup } = useUser();
  const [eta, setEta] = useState(15);

  // Simulate drone movement
  useEffect(() => {
    if (!currentDelivery) return;

    const statusProgression: DroneStatus[] = ['arriving', 'pickup', 'flying', 'delivered'];
    const currentIndex = statusProgression.indexOf(currentDelivery.status);

    // Auto-progress for arriving status only
    if (currentDelivery.status === 'arriving') {
      const timer = setTimeout(() => {
        updateDeliveryStatus('pickup');
        toast.info('Drone arrivato! Conferma il ritiro.');
      }, 5000);
      return () => clearTimeout(timer);
    }

    // Auto-complete flying to delivered
    if (currentDelivery.status === 'flying') {
      const timer = setTimeout(() => {
        updateDeliveryStatus('delivered');
        toast.success('Consegna completata!');
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [currentDelivery?.status]);

  // ETA countdown
  useEffect(() => {
    if (!currentDelivery || currentDelivery.status === 'delivered') return;

    const interval = setInterval(() => {
      setEta(prev => Math.max(0, prev - 1));
    }, 60000);

    return () => clearInterval(interval);
  }, [currentDelivery]);

  if (!currentDelivery) {
    return (
      <AppLayout>
        <div className="h-full flex flex-col items-center justify-center p-6 text-center">
          <DroneIcon className="w-24 h-24 text-muted-foreground/30 mb-6" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Nessuna consegna attiva
          </h2>
          <p className="text-muted-foreground mb-8">
            Richiedi un drone per iniziare il tracking
          </p>
          <button 
            onClick={() => navigate('/home')}
            className="btn-drone"
          >
            Richiedi Drone
          </button>
        </div>
      </AppLayout>
    );
  }

  const currentStepIndex = statusSteps.findIndex(s => s.status === currentDelivery.status);

  const handleConfirmPickup = () => {
    confirmPickup();
    toast.success('Ritiro confermato! Il drone è in volo.');
    setEta(10);
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col">
        {/* Map */}
        <MapPlaceholder 
          className="h-[40vh] rounded-none"
          showDrone
          droneStatus={currentDelivery.status}
          pickupLocation={currentDelivery.pickupLocation.address}
          deliveryLocation={currentDelivery.deliveryLocation.address}
        />

        {/* Tracking Info */}
        <div className="flex-1 -mt-6 bg-card rounded-t-3xl relative z-10">
          <div className="p-6 space-y-6">
            {/* Status Badge & ETA */}
            <div className="flex items-center justify-between">
              <StatusBadge status={currentDelivery.status} />
              {currentDelivery.status !== 'delivered' && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">ETA: {eta} min</span>
                </div>
              )}
            </div>

            {/* Drone Info */}
            <div className="glass-card p-4 flex items-center gap-4">
              <div className="relative">
                <DroneIcon 
                  className="w-14 h-14 text-primary" 
                  animated={currentDelivery.status !== 'delivered'} 
                />
              </div>
              <div className="flex-1">
                <p className="font-bold text-foreground">DRN-001</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Battery className="w-4 h-4 text-success" />
                  <span>85%</span>
                </div>
              </div>
              <button className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
                <Phone className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="space-y-4">
              {statusSteps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const Icon = step.icon;

                return (
                  <div key={step.status} className="flex items-center gap-4">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                      isCompleted && 'bg-success text-success-foreground',
                      isCurrent && 'bg-primary text-primary-foreground animate-pulse-soft',
                      !isCompleted && !isCurrent && 'bg-secondary text-muted-foreground'
                    )}>
                      {step.status === 'flying' ? (
                        <DroneIcon className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={cn(
                        'font-medium',
                        (isCompleted || isCurrent) ? 'text-foreground' : 'text-muted-foreground'
                      )}>
                        {step.label}
                      </p>
                      {isCurrent && currentDelivery.status === 'pickup' && (
                        <p className="text-sm text-warning">In attesa di conferma</p>
                      )}
                    </div>
                    {isCompleted && (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Locations */}
            <div className="glass-card p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-primary mt-1.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Ritiro</p>
                  <p className="font-medium text-foreground">
                    {currentDelivery.pickupLocation.address}
                  </p>
                </div>
              </div>
              <div className="ml-1.5 border-l-2 border-dashed border-border h-4" />
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-success mt-1.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Consegna</p>
                  <p className="font-medium text-foreground">
                    {currentDelivery.deliveryLocation.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            {currentDelivery.status === 'pickup' && (
              <button 
                onClick={handleConfirmPickup}
                className="btn-drone w-full flex items-center justify-center gap-2"
              >
                Conferma Ritiro
                <ArrowRight className="w-5 h-5" />
              </button>
            )}

            {currentDelivery.status === 'delivered' && (
              <button 
                onClick={() => navigate('/home')}
                className="btn-drone w-full"
              >
                Nuova Richiesta
              </button>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
