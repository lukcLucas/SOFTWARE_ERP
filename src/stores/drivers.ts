import { defineStore } from 'pinia';
import { ref } from 'vue';
import { format, addYears } from 'date-fns';
import type { Driver } from '../types';

export const useDriverStore = defineStore('drivers', () => {
  const drivers = ref<Driver[]>([
    {
      id: '1',
      name: 'João Silva',
      email: 'joao.silva@email.com',
      phone: '(11) 98765-4321',
      licenseNumber: '12345678901',
      licenseType: 'D',
      licenseExpiration: format(addYears(new Date(), 3), 'yyyy-MM-dd'),
      status: 'available'
    },
    {
      id: '2',
      name: 'Maria Oliveira',
      email: 'maria.oliveira@email.com',
      phone: '(11) 91234-5678',
      licenseNumber: '10987654321',
      licenseType: 'B',
      licenseExpiration: format(addYears(new Date(), 2), 'yyyy-MM-dd'),
      status: 'available'
    }
  ]);

  function addDriver(driver: Omit<Driver, 'id'>) {
    const newDriver = {
      ...driver,
      id: Date.now().toString()
    };
    drivers.value.push(newDriver);
    return newDriver;
  }

  function updateDriver(id: string, data: Partial<Driver>) {
    const index = drivers.value.findIndex(d => d.id === id);
    if (index !== -1) {
      drivers.value[index] = { ...drivers.value[index], ...data };
      return drivers.value[index];
    }
    return null;
  }

  function deleteDriver(id: string) {
    const index = drivers.value.findIndex(d => d.id === id);
    if (index !== -1) {
      drivers.value.splice(index, 1);
      return true;
    }
    return false;
  }

  function getDriversByStatus(status: string) {
    return drivers.value.filter(d => d.status === status);
  }

  function getDriverById(id: string) {
    return drivers.value.find(d => d.id === id);
  }

  return {
    drivers,
    addDriver,
    updateDriver,
    deleteDriver,
    getDriversByStatus,
    getDriverById
  };
});