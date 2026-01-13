import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { MapPlaceholder } from '@/components/map/MapPlaceholder';
import { DroneIcon } from '@/components/icons/DroneIcon';
import { MapPin, Home as HomeIcon, Search, ChevronRight, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Location } from '@/types/drone';
import { cn } from '@/lib/utils';

type PickupOption = 'home' | 'custom';

export default function Home() {
  const navigate = useNavigate();
  const { user, requestDrone, currentDelivery } = useUser();
  const [showRequestPanel, setShowRequestPanel] = useState(false);
  const [pickupOption, setPickupOption] = useState<PickupOption>('home');
  const [customPickup, setCustomPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestDrone = async () => {
    if (!destination) {
      toast.error('Inserisci una destinazione');
      return;
    }

    const pickupLocation: Location = pickupOption === 'home' 
      ? user?.homeAddress || { lat: 0, lng: 0, address: '' }
      : { lat: 0, lng: 0, address: customPickup };

    const deliveryLocation: Location = {
      lat: 0,
      lng: 0,
      address: destination
    };

    setIsRequesting(true);
    try {
      await requestDrone(pickupLocation, deliveryLocation);
      toast.success('Drone richiesto! Traccia il tuo ordine.');
      navigate('/tracking');
    } catch (error) {
      toast.error('Errore nella richiesta');
    } finally {
      setIsRequesting(false);
    }
  };

  // If there's an active delivery, redirect to tracking
  if (currentDelivery && currentDelivery.status !== 'delivered') {
    return (
      <AppLayout>
        <div className="h-full flex flex-col">
          <MapPlaceholder 
            className="flex-1" 
            showDrone 
            droneStatus={currentDelivery.status}
            pickupLocation={currentDelivery.pickupLocation.address}
            deliveryLocation={currentDelivery.deliveryLocation.address}
          />
          
          <div className="p-4">
            <div className="glass-card p-4 flex items-center gap-4">
              <DroneIcon className="w-12 h-12 text-primary" animated />
              <div className="flex-1">
                <p className="font-semibold text-foreground">Consegna in corso</p>
                <p className="text-sm text-muted-foreground">
                  {currentDelivery.status === 'arriving' && 'Drone in arrivo al ritiro'}
                  {currentDelivery.status === 'pickup' && 'In attesa di conferma ritiro'}
                  {currentDelivery.status === 'flying' && 'Drone in volo verso destinazione'}
                </p>
              </div>
              <button 
                onClick={() => navigate('/tracking')}
                className="btn-drone py-2 px-4 text-sm"
              >
                Traccia
              </button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="h-full flex flex-col relative">
        {/* Map */}
        <MapPlaceholder className="flex-1" />

        {/* Search Bar Overlay */}
        <div className="absolute top-4 left-4 right-4">
          <button 
            onClick={() => setShowRequestPanel(true)}
            className="w-full glass-card p-4 flex items-center gap-3 hover:bg-card transition-colors"
          >
            <Search className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground">Dove vuoi inviare?</span>
          </button>
        </div>

        {/* CTA Button */}
        {!showRequestPanel && (
          <div className="absolute bottom-24 left-4 right-4">
            <button 
              onClick={() => setShowRequestPanel(true)}
              className="btn-drone w-full flex items-center justify-center gap-3"
            >
              <DroneIcon className="w-6 h-6" />
              Richiedi un Drone
            </button>
          </div>
        )}

        {/* Request Panel */}
        {showRequestPanel && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in">
            <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl shadow-lg animate-slide-up max-h-[80vh] overflow-auto">
              {/* Header */}
              <div className="sticky top-0 bg-card p-4 border-b border-border flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Richiedi Drone</h2>
                <button 
                  onClick={() => setShowRequestPanel(false)}
                  className="p-2 rounded-xl hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="p-4 space-y-6">
                {/* Pickup Options */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground">
                    Punto di ritiro
                  </label>
                  
                  <button
                    onClick={() => setPickupOption('home')}
                    className={cn(
                      'w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all',
                      pickupOption === 'home' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      pickupOption === 'home' ? 'bg-primary/10' : 'bg-secondary'
                    )}>
                      <HomeIcon className={cn(
                        'w-6 h-6',
                        pickupOption === 'home' ? 'text-primary' : 'text-muted-foreground'
                      )} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-foreground">Ritiro a casa mia</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {user?.homeAddress?.address || 'Indirizzo non impostato'}
                      </p>
                    </div>
                    {pickupOption === 'home' && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <ChevronRight className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => setPickupOption('custom')}
                    className={cn(
                      'w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all',
                      pickupOption === 'custom' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      pickupOption === 'custom' ? 'bg-primary/10' : 'bg-secondary'
                    )}>
                      <MapPin className={cn(
                        'w-6 h-6',
                        pickupOption === 'custom' ? 'text-primary' : 'text-muted-foreground'
                      )} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-foreground">Altro punto di ritiro</p>
                      <p className="text-sm text-muted-foreground">
                        Seleziona sulla mappa
                      </p>
                    </div>
                  </button>

                  {pickupOption === 'custom' && (
                    <div className="relative animate-fade-in">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        value={customPickup}
                        onChange={(e) => setCustomPickup(e.target.value)}
                        placeholder="Inserisci indirizzo di ritiro"
                        className="input-drone pl-12"
                      />
                    </div>
                  )}
                </div>

                {/* Destination */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground">
                    Destinazione
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-success" />
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Dove vuoi inviare?"
                      className="input-drone pl-12"
                    />
                  </div>
                </div>

                {/* Drone Availability */}
                <div className="glass-card p-4 flex items-center gap-4">
                  <div className="relative">
                    <DroneIcon className="w-12 h-12 text-primary" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-card" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">DRN-001 disponibile</p>
                    <p className="text-sm text-muted-foreground">Tempo stimato: ~15 min</p>
                  </div>
                </div>

                {/* Confirm Button */}
                <button
                  onClick={handleRequestDrone}
                  disabled={isRequesting || !destination}
                  className="btn-drone w-full flex items-center justify-center gap-2"
                >
                  {isRequesting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Richiesta in corso...
                    </>
                  ) : (
                    <>
                      Conferma Richiesta
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
