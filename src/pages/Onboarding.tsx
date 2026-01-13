import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DroneIcon } from '@/components/icons/DroneIcon';
import { ChevronRight, Zap, Shield, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
const features = [{
  icon: Zap,
  title: 'Consegna Veloce',
  description: 'I nostri droni consegnano in meno di 30 minuti'
}, {
  icon: Shield,
  title: 'Sicuro & Affidabile',
  description: 'Tracciamento in tempo reale e consegna garantita'
}, {
  icon: Clock,
  title: 'Disponibile 24/7',
  description: 'Servizio attivo sempre, quando ne hai bisogno'
}];
export default function Onboarding() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  return <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-[44px] py-[32px]">
        {/* Logo & Drone Animation */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl scale-150" />
          <DroneIcon className="w-32 h-32 text-primary relative z-10" animated />
        </div>

        {/* Brand */}
        <h1 className="text-4xl font-extrabold text-foreground mb-2 tracking-tight">
          Drone<span className="text-primary">X</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-12">
          Consegna del futuro, oggi
        </p>

        {/* Features Carousel */}
        <div className="w-full max-w-sm mb-12">
          <div className="glass-card p-6 animate-fade-in">
            {features.map((feature, index) => <div key={index} className={cn('text-center transition-all duration-300', currentSlide === index ? 'block' : 'hidden')}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>)}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {features.map((_, index) => <button key={index} onClick={() => setCurrentSlide(index)} className={cn('w-2 h-2 rounded-full transition-all duration-300', currentSlide === index ? 'w-8 bg-primary' : 'bg-muted-foreground/30')} />)}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 pb-12 space-y-4">
        <button onClick={() => navigate('/signup')} className="btn-drone w-full flex items-center justify-center gap-2">
          Inizia Ora
          <ChevronRight className="w-5 h-5" />
        </button>
        
        <button onClick={() => navigate('/login')} className="w-full py-4 px-8 rounded-xl font-semibold text-foreground bg-secondary hover:bg-secondary/80 transition-colors">
          Ho già un account
        </button>
      </div>
    </div>;
}