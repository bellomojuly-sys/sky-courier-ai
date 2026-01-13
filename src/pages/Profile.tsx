import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { DroneIcon } from '@/components/icons/DroneIcon';
import { 
  User, 
  Mail, 
  MapPin, 
  LogOut, 
  ChevronRight,
  Settings,
  CreditCard,
  HelpCircle,
  Bell,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

const menuItems = [
  { icon: CreditCard, label: 'Metodi di pagamento', path: '/payments' },
  { icon: Bell, label: 'Notifiche', path: '/notifications' },
  { icon: Shield, label: 'Privacy e sicurezza', path: '/privacy' },
  { icon: HelpCircle, label: 'Assistenza', path: '/help' },
  { icon: Settings, label: 'Impostazioni', path: '/settings' },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    toast.success('Disconnesso con successo');
    navigate('/');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <AppLayout>
      <div className="p-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{user.email}</span>
            </div>
          </div>
        </div>

        {/* Home Address */}
        <div className="glass-card p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Indirizzo di casa</p>
              <p className="font-medium text-foreground">{user.homeAddress.address}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-4 text-center">
            <DroneIcon className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {user.deliveryHistory.length}
            </p>
            <p className="text-xs text-muted-foreground">Consegne</p>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-2">
              <span className="text-success text-lg">✓</span>
            </div>
            <p className="text-2xl font-bold text-foreground">100%</p>
            <p className="text-xs text-muted-foreground">Successo</p>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-2">
              <span className="text-warning text-lg">⭐</span>
            </div>
            <p className="text-2xl font-bold text-foreground">4.9</p>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2 mb-6">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className="w-full p-4 rounded-xl bg-card hover:bg-secondary transition-colors flex items-center gap-4"
            >
              <item.icon className="w-5 h-5 text-muted-foreground" />
              <span className="flex-1 text-left font-medium text-foreground">
                {item.label}
              </span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full p-4 rounded-xl bg-destructive/10 hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2 text-destructive font-medium"
        >
          <LogOut className="w-5 h-5" />
          Esci
        </button>
      </div>
    </AppLayout>
  );
}
