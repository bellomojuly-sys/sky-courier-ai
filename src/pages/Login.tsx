import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { DroneIcon } from '@/components/icons/DroneIcon';
import { Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Inserisci email e password');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Accesso effettuato!');
        navigate('/home');
      } else {
        toast.error('Credenziali non valide');
      }
    } catch (error) {
      toast.error('Errore durante l\'accesso');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-4 py-4 flex items-center">
        <button 
          onClick={() => navigate('/')}
          className="p-2 rounded-xl hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
      </header>

      <div className="flex-1 flex flex-col px-6 py-8">
        {/* Logo */}
        <div className="text-center mb-12">
          <DroneIcon className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground">Bentornato</h1>
          <p className="text-muted-foreground mt-2">
            Accedi al tuo account DroneX
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="input-drone pl-12"
              autoComplete="email"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input-drone pl-12"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-drone w-full flex items-center justify-center gap-2 mt-8"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Accedi'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button className="text-primary font-medium hover:underline">
            Password dimenticata?
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 text-center">
        <p className="text-muted-foreground">
          Non hai un account?{' '}
          <button 
            onClick={() => navigate('/signup')}
            className="text-primary font-semibold hover:underline"
          >
            Registrati
          </button>
        </p>
      </div>
    </div>
  );
}
