export type DroneStatus = 'idle' | 'arriving' | 'pickup' | 'flying' | 'delivered';

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Drone {
  id: string;
  name: string;
  status: DroneStatus;
  batteryLevel: number;
  currentLocation: Location;
  eta: number; // minutes
}

export interface DeliveryRequest {
  id: string;
  userId: string;
  pickupLocation: Location;
  deliveryLocation: Location;
  status: DroneStatus;
  droneId?: string;
  createdAt: Date;
  estimatedArrival?: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  homeAddress: Location;
  deliveryHistory: DeliveryRequest[];
}
