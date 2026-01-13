import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Location, DeliveryRequest, DroneStatus } from '@/types/drone';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  currentDelivery: DeliveryRequest | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, homeAddress: Location) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  requestDrone: (pickup: Location, delivery: Location) => Promise<DeliveryRequest>;
  updateDeliveryStatus: (status: DroneStatus) => void;
  confirmPickup: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock user for demo
const mockUser: User = {
  id: '1',
  name: 'Marco Rossi',
  email: 'marco@example.com',
  avatar: undefined,
  homeAddress: {
    lat: 41.9028,
    lng: 12.4964,
    address: 'Via Roma 123, Roma, Italia'
  },
  deliveryHistory: []
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentDelivery, setCurrentDelivery] = useState<DeliveryRequest | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      setUser({ ...mockUser, email });
      return true;
    }
    return false;
  };

  const signup = async (
    name: string, 
    email: string, 
    password: string, 
    homeAddress: Location
  ): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (name && email && password) {
      setUser({
        ...mockUser,
        id: Date.now().toString(),
        name,
        email,
        homeAddress
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCurrentDelivery(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const requestDrone = async (pickup: Location, delivery: Location): Promise<DeliveryRequest> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newDelivery: DeliveryRequest = {
      id: Date.now().toString(),
      userId: user?.id || '',
      pickupLocation: pickup,
      deliveryLocation: delivery,
      status: 'arriving',
      droneId: 'DRN-001',
      createdAt: new Date(),
      estimatedArrival: new Date(Date.now() + 15 * 60 * 1000) // 15 min
    };
    
    setCurrentDelivery(newDelivery);
    return newDelivery;
  };

  const updateDeliveryStatus = (status: DroneStatus) => {
    if (currentDelivery) {
      const updated = { ...currentDelivery, status };
      setCurrentDelivery(updated);
      
      if (status === 'delivered' && user) {
        setUser({
          ...user,
          deliveryHistory: [updated, ...user.deliveryHistory]
        });
      }
    }
  };

  const confirmPickup = () => {
    updateDeliveryStatus('flying');
  };

  return (
    <UserContext.Provider value={{
      user,
      isAuthenticated: !!user,
      currentDelivery,
      login,
      signup,
      logout,
      updateProfile,
      requestDrone,
      updateDeliveryStatus,
      confirmPickup
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
