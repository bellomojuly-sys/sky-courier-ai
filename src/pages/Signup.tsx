import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { DroneIcon } from '@/components/icons/DroneIcon';
import { User, Mail, Lock, MapPin, ArrowLeft, Loader2, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { Location } from '@/types/drone';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useUser();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    avatar: null as string | null
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStep1 = () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Compila tutti i campi');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Le password non corrispondono');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('La password deve avere almeno 6 caratteri');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.address) {
      toast.error('Inserisci il tuo indirizzo');
      return;
    }

    setIsLoading(true);
    try {
      const homeAddress: Location = {
        lat: 41.9028,
        lng: 12.4964,
        address: formData.address
      };

      const success = await signup(
        formData.name,
        formData.email,
        formData.password,
        homeAddress
      );

      if (success) {
        toast.success('Account creato con successo!');
        navigate('/home');
      } else {
        toast.error('Errore nella registrazione');
      }
    } catch (error) {
      toast.error('Errore durante la registrazione');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-4 py-4 flex items-center justify-between">
        <button 
          onClick={() => step === 1 ? navigate('/') : setStep(1)}
          className="p-2 rounded-xl hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <span className="text-sm text-muted-foreground">
          Passo {step} di 2
        </span>
        <div className="w-10" />
      </header>

      {/* Progress Bar */}
      <div className="px-6 mb-8">
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${step * 50}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col px-6">
        {step === 1 ? (
          <>
            {/* Step 1: Account Info */}
            <div className="text-center mb-8">
              <DroneIcon className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-foreground">Crea Account</h1>
              <p className="text-muted-foreground mt-2">
                Inserisci i tuoi dati per iniziare
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Nome completo"
                  className="input-drone pl-12"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="Email"
                  className="input-drone pl-12"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="Password"
                  className="input-drone pl-12"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  placeholder="Conferma password"
                  className="input-drone pl-12"
                />
              </div>

              <button
                type="button"
                onClick={handleStep1}
                className="btn-drone w-full mt-8"
              >
                Continua
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Step 2: Profile & Address */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground">Il tuo profilo</h1>
              <p className="text-muted-foreground mt-2">
                Aggiungi una foto e il tuo indirizzo
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                    {formData.avatar ? (
                      <img 
                        src={formData.avatar} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-muted-foreground" />
                    )}
                  </div>
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg"
                  >
                    <Camera className="w-4 h-4 text-primary-foreground" />
                  </button>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Indirizzo di casa
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="Via Roma 123, Roma"
                    className="input-drone pl-12"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Questo sarà il tuo punto di ritiro predefinito
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-drone w-full flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Completa Registrazione'
                )}
              </button>
            </form>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 text-center">
        <p className="text-muted-foreground">
          Hai già un account?{' '}
          <button 
            onClick={() => navigate('/login')}
            className="text-primary font-semibold hover:underline"
          >
            Accedi
          </button>
        </p>
      </div>
    </div>
  );
}
