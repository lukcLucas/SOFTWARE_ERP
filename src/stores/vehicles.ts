import { defineStore } from 'pinia';
import { ref } from 'vue';
import { format, addMonths } from 'date-fns';
import type { Vehicle, MaintenanceRecord, FuelRecord, VehicleDocument } from '../types';

export const useVehicleStore = defineStore('vehicles', () => {
  const vehicles = ref<Vehicle[]>([
    {
      id: '1',
      plate: 'ABC-1234',
      brand: 'Volkswagen',
      model: 'Delivery 9.170',
      year: 2022,
      type: 'truck',
      status: 'available',
      fuelType: 'diesel',
      fuelEfficiency: 8.5, // km/L
      lastMaintenance: format(new Date(), 'yyyy-MM-dd'),
      nextMaintenance: format(addMonths(new Date(), 3), 'yyyy-MM-dd'),
      odometer: 15000,
      documents: [
        {
          id: '1',
          type: 'Licenciamento',
          number: '123456789',
          expirationDate: format(addMonths(new Date(), 10), 'yyyy-MM-dd'),
          status: 'valid'
        }
      ],
      maintenanceHistory: [
        {
          id: '1',
          date: format(new Date(), 'yyyy-MM-dd'),
          type: 'preventive',
          description: 'Troca de óleo e filtros',
          cost: 850,
          odometer: 15000,
          provider: 'Oficina Autorizada VW'
        }
      ],
      fuelHistory: [
        {
          id: '1',
          date: format(new Date(), 'yyyy-MM-dd'),
          fuelType: 'diesel',
          quantity: 100,
          cost: 500,
          odometer: 15000,
          fullTank: true,
          station: 'Posto Ipiranga'
        }
      ]
    },
    {
      id: '2',
      plate: 'DEF-5678',
      brand: 'Fiat',
      model: 'Fiorino',
      year: 2021,
      type: 'van',
      status: 'available',
      fuelType: 'gasoline',
      fuelEfficiency: 10.2, // km/L
      lastMaintenance: format(new Date(), 'yyyy-MM-dd'),
      nextMaintenance: format(addMonths(new Date(), 2), 'yyyy-MM-dd'),
      odometer: 25000,
      documents: [
        {
          id: '1',
          type: 'Licenciamento',
          number: '987654321',
          expirationDate: format(addMonths(new Date(), 8), 'yyyy-MM-dd'),
          status: 'valid'
        }
      ],
      maintenanceHistory: [
        {
          id: '1',
          date: format(new Date(), 'yyyy-MM-dd'),
          type: 'preventive',
          description: 'Revisão completa',
          cost: 650,
          odometer: 25000,
          provider: 'Oficina Autorizada Fiat'
        }
      ],
      fuelHistory: [
        {
          id: '1',
          date: format(new Date(), 'yyyy-MM-dd'),
          fuelType: 'gasoline',
          quantity: 50,
          cost: 300,
          odometer: 25000,
          fullTank: true,
          station: 'Posto Shell'
        }
      ]
    }
  ]);

  function addVehicle(vehicle: Omit<Vehicle, 'id'>) {
    const newVehicle = {
      ...vehicle,
      id: Date.now().toString(),
      documents: [],
      maintenanceHistory: [],
      fuelHistory: []
    };
    vehicles.value.push(newVehicle);
    return newVehicle;
  }

  function updateVehicle(id: string, data: Partial<Vehicle>) {
    const index = vehicles.value.findIndex(v => v.id === id);
    if (index !== -1) {
      vehicles.value[index] = { ...vehicles.value[index], ...data };
      return vehicles.value[index];
    }
    return null;
  }

  function deleteVehicle(id: string) {
    const index = vehicles.value.findIndex(v => v.id === id);
    if (index !== -1) {
      vehicles.value.splice(index, 1);
      return true;
    }
    return false;
  }

  function addMaintenanceRecord(vehicleId: string, record: Omit<MaintenanceRecord, 'id'>) {
    const vehicle = vehicles.value.find(v => v.id === vehicleId);
    if (vehicle) {
      const newRecord = {
        ...record,
        id: Date.now().toString()
      };
      vehicle.maintenanceHistory.push(newRecord);
      vehicle.lastMaintenance = record.date;
      vehicle.odometer = record.odometer;
      return newRecord;
    }
    return null;
  }

  function addFuelRecord(vehicleId: string, record: Omit<FuelRecord, 'id'>) {
    const vehicle = vehicles.value.find(v => v.id === vehicleId);
    if (vehicle) {
      const newRecord = {
        ...record,
        id: Date.now().toString()
      };
      vehicle.fuelHistory.push(newRecord);
      vehicle.odometer = record.odometer;
      return newRecord;
    }
    return null;
  }

  function addVehicleDocument(vehicleId: string, document: Omit<VehicleDocument, 'id'>) {
    const vehicle = vehicles.value.find(v => v.id === vehicleId);
    if (vehicle) {
      const newDocument = {
        ...document,
        id: Date.now().toString()
      };
      vehicle.documents.push(newDocument);
      return newDocument;
    }
    return null;
  }

  function getVehiclesByStatus(status: string) {
    return vehicles.value.filter(v => v.status === status);
  }

  return {
    vehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    addMaintenanceRecord,
    addFuelRecord,
    addVehicleDocument,
    getVehiclesByStatus
  };
});