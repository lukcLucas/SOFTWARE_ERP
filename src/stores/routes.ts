import { defineStore } from 'pinia';
import { ref } from 'vue';
import { format } from 'date-fns';
import type { DeliveryRoute, RouteDestination } from '../types';
import { useDriverStore } from './drivers';
import { useVehicleStore } from './vehicles';

export const useRouteStore = defineStore('routes', () => {
  const routes = ref<DeliveryRoute[]>([
    {
      id: '1',
      name: 'Entrega Zona Sul',
      description: 'Entregas para clientes da zona sul',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
      status: 'in_progress',
      driverId: '1',
      driverName: 'João Silva',
      vehicleId: '1',
      vehiclePlate: 'ABC-1234',
      startingPoint: 'Depósito Central',
      destinations: [
        {
          id: '1',
          address: 'Rua Augusta, 1000, São Paulo, SP',
          scheduledArrival: format(new Date(), 'yyyy-MM-dd HH:mm'),
          status: 'pending',
          notes: 'Entregar no período da manhã',
          order: 1
        },
        {
          id: '2',
          address: 'Av. Paulista, 500, São Paulo, SP',
          scheduledArrival: format(new Date(), 'yyyy-MM-dd HH:mm'),
          status: 'pending',
          notes: 'Entregar após o almoço',
          order: 2
        }
      ],
      totalDistance: 45,
      estimatedFuelCost: 250
    }
  ]);

  const driverStore = useDriverStore();
  const vehicleStore = useVehicleStore();

  function addRoute(route: Omit<DeliveryRoute, 'id'>) {
    const newRoute = {
      ...route,
      id: Date.now().toString()
    };
    
    // Update driver and vehicle status
    driverStore.updateDriver(route.driverId, { status: 'on_route' });
    vehicleStore.updateVehicle(route.vehicleId, { status: 'in_use' });
    
    routes.value.push(newRoute);
    return newRoute;
  }

  function updateRoute(id: string, data: Partial<DeliveryRoute>) {
    const index = routes.value.findIndex(r => r.id === id);
    if (index !== -1) {
      routes.value[index] = { ...routes.value[index], ...data };
      return routes.value[index];
    }
    return null;
  }

  function deleteRoute(id: string) {
    const index = routes.value.findIndex(r => r.id === id);
    if (index !== -1) {
      const route = routes.value[index];
      
      // Free up driver and vehicle if route is deleted
      if (route.status === 'in_progress') {
        driverStore.updateDriver(route.driverId, { status: 'available' });
        vehicleStore.updateVehicle(route.vehicleId, { status: 'available' });
      }
      
      routes.value.splice(index, 1);
      return true;
    }
    return false;
  }

  function completeRoute(id: string) {
    const route = routes.value.find(r => r.id === id);
    if (route) {
      route.status = 'completed';
      
      // Free up driver and vehicle
      driverStore.updateDriver(route.driverId, { status: 'available' });
      vehicleStore.updateVehicle(route.vehicleId, { status: 'available' });
      
      return route;
    }
    return null;
  }

  function updateDestination(routeId: string, destinationId: string, data: Partial<RouteDestination>) {
    const route = routes.value.find(r => r.id === routeId);
    if (route) {
      const destIndex = route.destinations.findIndex(d => d.id === destinationId);
      if (destIndex !== -1) {
        route.destinations[destIndex] = { ...route.destinations[destIndex], ...data };
        return route.destinations[destIndex];
      }
    }
    return null;
  }

  function completeDestination(routeId: string, destinationId: string) {
    const route = routes.value.find(r => r.id === routeId);
    if (route) {
      const destination = route.destinations.find(d => d.id === destinationId);
      if (destination) {
        destination.status = 'completed';
        destination.actualArrival = format(new Date(), 'yyyy-MM-dd HH:mm');
        
        // Check if all destinations are completed
        const allCompleted = route.destinations.every(d => d.status === 'completed');
        if (allCompleted) {
          route.status = 'completed';
          
          // Free up driver and vehicle
          driverStore.updateDriver(route.driverId, { status: 'available' });
          vehicleStore.updateVehicle(route.vehicleId, { status: 'available' });
        }
        
        return destination;
      }
    }
    return null;
  }

  function addDestination(routeId: string, destination: Omit<RouteDestination, 'id'>) {
    const route = routes.value.find(r => r.id === routeId);
    if (route) {
      const newDestination = {
        ...destination,
        id: Date.now().toString()
      };
      route.destinations.push(newDestination);
      return newDestination;
    }
    return null;
  }

  function getActiveRoutes() {
    return routes.value.filter(r => r.status === 'in_progress');
  }

  return {
    routes,
    addRoute,
    updateRoute,
    deleteRoute,
    completeRoute,
    updateDestination,
    completeDestination,
    addDestination,
    getActiveRoutes
  };
});