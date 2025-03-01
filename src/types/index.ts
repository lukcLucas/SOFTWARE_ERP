export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  customerId: string;
  customerName: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  budget: number;
  cost: number;
  tasks: ProjectTask[];
  resources: ProjectResource[];
}

export interface ProjectTask {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  assignedTo: string[];
  progress: number;
}

export interface ProjectResource {
  id: string;
  name: string;
  type: 'human' | 'material' | 'service';
  cost: number;
  quantity: number;
}

// Fleet Management Types
export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  type: 'car' | 'truck' | 'van' | 'motorcycle' | 'other';
  status: 'available' | 'in_use' | 'maintenance' | 'inactive';
  fuelType: 'gasoline' | 'diesel' | 'ethanol' | 'electric' | 'hybrid';
  fuelEfficiency: number; // km/L
  lastMaintenance: string;
  nextMaintenance: string;
  odometer: number;
  documents: VehicleDocument[];
  maintenanceHistory: MaintenanceRecord[];
  fuelHistory: FuelRecord[];
}

export interface VehicleDocument {
  id: string;
  type: string;
  name?: string;
  number: string;
  expirationDate: string;
  status: 'valid' | 'expired' | 'pending';
}

export interface MaintenanceRecord {
  id: string;
  date: string;
  type: 'preventive' | 'corrective' | 'inspection';
  description: string;
  cost: number;
  odometer: number;
  provider: string;
  notes?: string;
  kmAtMaintenance?: number;
}

export interface FuelRecord {
  id: string;
  date: string;
  fuelType: 'gasoline' | 'diesel' | 'ethanol' | 'electric' | 'hybrid';
  quantity: number;
  liters?: number;
  cost: number;
  odometer: number;
  kmAtRefueling?: number;
  fullTank: boolean;
  station: string;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseType: string;
  licenseExpiration: string;
  status: 'available' | 'on_route' | 'off_duty' | 'inactive';
  currentVehicleId?: string;
}

export interface DeliveryRoute {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  driverId: string;
  driverName: string;
  vehicleId: string;
  vehiclePlate: string;
  startingPoint: string;
  destinations: RouteDestination[];
  totalDistance: number;
  estimatedFuelCost: number;
}

export interface RouteDestination {
  id: string;
  address: string;
  scheduledArrival: string;
  actualArrival?: string;
  status: 'pending' | 'completed' | 'cancelled' | 'delayed' | 'arrived' | 'skipped';
  notes?: string;
  order: number;
}

// Facilities Management Types
export interface Facility {
  id: string;
  name: string;
  address: string;
  type: 'office' | 'warehouse' | 'retail' | 'other';
  size: number; // in square meters
  floors: number;
  status: 'active' | 'inactive' | 'under_maintenance' | 'under_construction';
  maintenanceRecords: FacilityMaintenanceRecord[];
  rooms: Room[];
  utilities: UtilityConsumption[];
}

export interface Room {
  id: string;
  facilityId: string;
  name: string;
  type: 'meeting' | 'office' | 'storage' | 'common' | 'other';
  capacity: number;
  floor: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  equipment: Equipment[];
  reservations: RoomReservation[];
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  serialNumber?: string;
  purchaseDate: string;
  warrantyExpiration?: string;
  status: 'operational' | 'maintenance' | 'broken' | 'retired';
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
}

export interface RoomReservation {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  purpose: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  attendees: number;
  notes?: string;
}

export interface FacilityMaintenanceRecord {
  id: string;
  facilityId: string;
  date: string;
  type: 'preventive' | 'corrective' | 'inspection' | 'emergency';
  description: string;
  area: string;
  cost: number;
  provider: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  completionDate?: string;
  notes?: string;
}

export interface UtilityConsumption {
  id: string;
  facilityId: string;
  type: 'electricity' | 'water' | 'gas' | 'internet' | 'other';
  year: number;
  month: number;
  reading: number;
  unit: string; // kWh, m³, etc.
  cost: number;
  notes?: string;
}