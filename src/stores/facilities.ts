import { defineStore } from 'pinia';
import { ref } from 'vue';
import { format, addMonths } from 'date-fns';
import type { 
  Facility, 
  Room, 
  Equipment, 
  RoomReservation, 
  FacilityMaintenanceRecord, 
  UtilityConsumption 
} from '../types';

export const useFacilityStore = defineStore('facilities', () => {
  const facilities = ref<Facility[]>([
    {
      id: '1',
      name: 'Sede Principal',
      address: 'Av. Paulista, 1000, São Paulo, SP',
      type: 'office',
      size: 1500,
      floors: 3,
      status: 'active',
      maintenanceRecords: [
        {
          id: '1',
          facilityId: '1',
          date: format(new Date(), 'yyyy-MM-dd'),
          type: 'preventive',
          description: 'Manutenção do sistema de ar condicionado',
          area: 'Infraestrutura',
          cost: 2500,
          provider: 'Refrigeração Técnica Ltda',
          status: 'completed',
          completionDate: format(new Date(), 'yyyy-MM-dd'),
          notes: 'Troca de filtros e limpeza geral'
        }
      ],
      rooms: [
        {
          id: '1',
          facilityId: '1',
          name: 'Sala de Reunião 1',
          type: 'meeting',
          capacity: 10,
          floor: 1,
          status: 'available',
          equipment: [
            {
              id: '1',
              name: 'Projetor',
              type: 'audiovisual',
              serialNumber: 'PRJ-2023-001',
              purchaseDate: '2023-01-15',
              warrantyExpiration: '2025-01-15',
              status: 'operational',
              lastMaintenanceDate: '2023-06-10',
              nextMaintenanceDate: '2023-12-10'
            },
            {
              id: '2',
              name: 'Smart TV',
              type: 'audiovisual',
              serialNumber: 'TV-2022-005',
              purchaseDate: '2022-05-20',
              warrantyExpiration: '2024-05-20',
              status: 'operational'
            }
          ],
          reservations: [
            {
              id: '1',
              roomId: '1',
              userId: '1',
              userName: 'João Silva',
              purpose: 'Reunião de Planejamento',
              startTime: '2023-10-15T09:00:00',
              endTime: '2023-10-15T11:00:00',
              status: 'completed',
              attendees: 8,
              notes: 'Preparar apresentação de slides'
            }
          ]
        },
        {
          id: '2',
          facilityId: '1',
          name: 'Sala de Reunião 2',
          type: 'meeting',
          capacity: 6,
          floor: 1,
          status: 'available',
          equipment: [
            {
              id: '3',
              name: 'Smart TV',
              type: 'audiovisual',
              serialNumber: 'TV-2022-006',
              purchaseDate: '2022-05-20',
              warrantyExpiration: '2024-05-20',
              status: 'operational'
            }
          ],
          reservations: []
        },
        {
          id: '3',
          facilityId: '1',
          name: 'Escritório Aberto',
          type: 'office',
          capacity: 30,
          floor: 2,
          status: 'occupied',
          equipment: [],
          reservations: []
        }
      ],
      utilities: [
        {
          id: '1',
          facilityId: '1',
          type: 'electricity',
          year: 2023,
          month: 9,
          reading: 5200,
          unit: 'kWh',
          cost: 3120,
          notes: 'Aumento de 5% em relação ao mês anterior'
        },
        {
          id: '2',
          facilityId: '1',
          type: 'water',
          year: 2023,
          month: 9,
          reading: 45,
          unit: 'm³',
          cost: 675,
          notes: 'Consumo normal'
        }
      ]
    },
    {
      id: '2',
      name: 'Depósito Zona Leste',
      address: 'Rua das Indústrias, 500, São Paulo, SP',
      type: 'warehouse',
      size: 2500,
      floors: 1,
      status: 'active',
      maintenanceRecords: [],
      rooms: [
        {
          id: '4',
          facilityId: '2',
          name: 'Área de Estoque Principal',
          type: 'storage',
          capacity: 0,
          floor: 1,
          status: 'available',
          equipment: [],
          reservations: []
        },
        {
          id: '5',
          facilityId: '2',
          name: 'Escritório Administrativo',
          type: 'office',
          capacity: 5,
          floor: 1,
          status: 'available',
          equipment: [],
          reservations: []
        }
      ],
      utilities: [
        {
          id: '3',
          facilityId: '2',
          type: 'electricity',
          year: 2023,
          month: 9,
          reading: 3800,
          unit: 'kWh',
          cost: 2280,
          notes: 'Consumo normal'
        }
      ]
    }
  ]);

  // Facility CRUD operations
  function addFacility(facility: Omit<Facility, 'id' | 'maintenanceRecords' | 'rooms' | 'utilities'>) {
    const newFacility = {
      ...facility,
      id: Date.now().toString(),
      maintenanceRecords: [],
      rooms: [],
      utilities: []
    };
    facilities.value.push(newFacility);
    return newFacility;
  }

  function updateFacility(id: string, data: Partial<Facility>) {
    const index = facilities.value.findIndex(f => f.id === id);
    if (index !== -1) {
      facilities.value[index] = { ...facilities.value[index], ...data };
      return facilities.value[index];
    }
    return null;
  }

  function deleteFacility(id: string) {
    const index = facilities.value.findIndex(f => f.id === id);
    if (index !== -1) {
      facilities.value.splice(index, 1);
      return true;
    }
    return false;
  }

  // Room CRUD operations
  function addRoom(facilityId: string, room: Omit<Room, 'id' | 'facilityId' | 'equipment' | 'reservations'>) {
    const facility = facilities.value.find(f => f.id === facilityId);
    if (facility) {
      const newRoom = {
        ...room,
        id: Date.now().toString(),
        facilityId,
        equipment: [],
        reservations: []
      };
      facility.rooms.push(newRoom);
      return newRoom;
    }
    return null;
  }

  function updateRoom(facilityId: string, roomId: string, data: Partial<Room>) {
    const facility = facilities.value.find(f => f.id === facilityId);
    if (facility) {
      const roomIndex = facility.rooms.findIndex(r => r.id === roomId);
      if (roomIndex !== -1) {
        facility.rooms[roomIndex] = { ...facility.rooms[roomIndex], ...data };
        return facility.rooms[roomIndex];
      }
    }
    return null;
  }

  function deleteRoom(facilityId: string, roomId: string) {
    const facility = facilities.value.find(f => f.id === facilityId);
    if (facility) {
      const roomIndex = facility.rooms.findIndex(r => r.id === roomId);
      if (roomIndex !== -1) {
        facility.rooms.splice(roomIndex, 1);
        return true;
      }
    }
    return false;
  }

  // Equipment CRUD operations
  function addEquipment(facilityId: string, roomId: string, equipment: Omit<Equipment, 'id'>) {
    const facility = facilities.value.find(f => f.id === facilityId);
    if (facility) {
      const room = facility.rooms.find(r => r.id === roomId);
      if (room) {
        const newEquipment = {
          ...equipment,
          id: Date.now().toString()
        };
        room.equipment.push(newEquipment);
        return newEquipment;
      }
    }
    return null;
  }

  function updateEquipment(facilityId: string, roomId: string, equipmentId: string, data: Partial<Equipment>) {
    const facility = facilities.value.find(f => f.id === facilityId);
    if (facility) {
      const room = facility.rooms.find(r => r.id === roomId);
      if (room) {
        const equipmentIndex = room.equipment.findIndex(e => e.id === equipmentId);
        if (equipmentIndex !== -1) {
          room.equipment[equipmentIndex] = { ...room.equipment[equipmentIndex], ...data };
          return room.equipment[equipmentIndex];
        }
      }
    }
    return null;
  }

  function deleteEquipment(facilityId: string, roomId: string, equipmentId: string) {
    const facility = facilities.value.find(f => f.id === facilityId);
    if (facility) {
      const room = facility.rooms.find(r => r.id === roomId);
      if (room) {
        const equipmentIndex = room.equipment.findIndex(e => e.id === equipmentId);
        if (equipmentIndex !== -1) {
          room.equipment.splice(equipmentIndex, 1);
          return true;
        }
      }
    }
    return false;
  }

  // Room Reservation CRUD operations
  function addReservation(facilityId: string, roomId: string, reservation: Omit<RoomReservation, 'id' | 'roomId'>) {
    const facility = facilities.value.find(f => f.id === facilityId);
    if (facility) {
      const room = facility.rooms.find(r => r.id === roomId);
      if (room) {
        // Check if room is available
        if (room.status !== 'available' && room.status !== 'reserved') {
          return { error: 'Room is not available for reservation' };
        }

        // Check for time conflicts
        const hasConflict = room.reservations.some(r => {
          const newStart = new Date(reservation.startTime).getTime();
          const newEnd = new Date(reservation.endTime).getTime();
          const existingStart = new Date(r.startTime).getTime();
          const existingEnd = new Date(r.endTime).getTime();

          return (
            (newStart >= existingStart && newStart < existingEnd) ||
            (newEnd > existingStart && newEnd <= existingEnd) ||
            (newStart <= existingStart && newEnd >= existingEnd)
          );
        });

        if (hasConflict) {
          return { error: 'Time slot is already reserved' };
        }

        const newReservation = {
          ...reservation,
          id: Date.now().toString(),
          roomId
        };
        room.reservations.push(newReservation);
        
        // Update room status if reservation is current
        const now = new Date().getTime();
        const startTime = new Date(reservation.startTime).getTime();
        const endTime = new Date(reservation.endTime).getTime();
        
        if (now >= startTime && now < endTime) {
          room.status = 'occupied';
        } else if (now < startTime) {
          room.status = 'reserved';
        }
        
        return newReservation;
      }
    }
    return null;
  }

  function updateReservation(facilityId: string, roomId: string, reservationId: string, data: Partial<RoomReservation>) {
    const facility = facilities.value.find(f => f.id === facilityId);
    if (facility) {
      const room = facility.rooms.find(r => r.id === roomId);
      if (room) {
        const reservationIndex = room.reservations.findIndex(r => r.id === reservationId);
        if (reservationIndex !== -1) {
          room.reservations[reservationIndex] = { ...room.reservations[reservationIndex], ...data };
          
          // Update room status based on reservation status
          if (data.status === 'cancelled') {
            // Check if there are other active reservations
            const hasActiveReservations = room.reservations.some(r => 
              r.id !== reservationId && 
              r.status !== 'cancelled' && 
              r.status !== 'completed'
            );
            
            if (!hasActiveReservations) {
              room.status = 'available';
            }
          }
          
          return room.reservations[reservationIndex];
        }
      }
    }
    return null;
  }

  function deleteReservation(facilityId: string, roomId: string, reservationId: string) {
    const facility = facilities.value.find(f => f.id === facilityId);
    if (facility) {
      const room = facility.rooms.find(r => r.id === roomId);
      if (room) {
        const reservationIndex = room.reservations.findIndex(r => r.id === reservationId);
        if (reservationIndex !== -1) {
          room.reservations.splice(reservationIndex, 1);
          
          // Update room status if no more active reservations
          const hasActiveReservations = room.reservations.some(r => 
            r.status !== 'cancelled' && 
            r.status !== 'completed'
          );
          
          if (!hasActiveReservations) {
            room.status = 'available';
          }
          
          return true;
        }
      }
    }
    return false;
  }

  // Maintenance CRUD operations
  function addMaintenanceRecord(facilityId: string, record: Omit<FacilityMaintenanceRecord, 'id' | 'facilityId'>) {
    const facility = facilities.value.find(f => f.id === facilityId);
    if (facility) {
      const newRecord = {
        ...record,
        id: Date.now().toString(),
        facilityId
      };
      facility.maintenanceRecords.push(newRecord);
      return newRecord;
    }
    return null;
  }

  function updateMaintenanceRecord(facilityId: string, recordId: string, data: Partial<FacilityMaintenanceRecord>) {
    const facility = facilities.value.find(f => f.id === facilityId);
    if (facility) {
      const recordIndex = facility.maintenanceRecords.findIndex(r => r.id === recordId);
      if (recordIndex !== -1) {
        facility.maintenanceRecords[recordIndex] = { ...facility.maintenanceRecords[recordIndex], ...data };
        return facility.maintenanceRecords[recordIndex];
      }
    }
    return null;
  }

  function deleteMaintenanceRecord(facilityId: string, recordId: string) {
    const facility = facilities.value.find(f => f.id === facilityId);
    if (facility) {
      const recordIndex = facility.maintenanceRecords.findIndex(r => r.id === recordId);
      if (recordIndex !== -1) {
        facility.maintenanceRecords.splice(recordIndex, 1);
        return true;
      }
    }
    return false;
  }

  // Utility Consumption CRUD operations
  function addUtilityConsumption(facilityId: string, consumption: Omit<UtilityConsumption, 'id' | 'facilityId'>) {
    const facility = facilities.value.find(f => f.id === facilityId);
    if (facility) {
      const newConsumption = {
        ...consumption,
        id: Date.now().toString(),
        facilityId
      };
      facility.utilities.push(newConsumption);
      return newConsumption;
    }
    return null;
  }

  function updateUtilityConsumption(facilityId: string, consumptionId: string, data: Partial<UtilityConsumption>) {
    const facility = facilities.value.find(f => f.id === facilityId);
    if (facility) {
      const consumptionIndex = facility.utilities.findIndex(u => u.id === consumptionId);
      if (consumptionIndex !== -1) {
        facility.utilities[consumptionIndex] = { ...facility.utilities[consumptionIndex], ...data };
        return facility.utilities[consumptionIndex];
      }
    }
    return null;
  }

  function deleteUtilityConsumption(facilityId: string, consumptionId: string) {
    const facility = facilities.value.find(f => f.id === facilityId);
    if (facility) {
      const consumptionIndex = facility.utilities.findIndex(u => u.id === consumptionId);
      if (consumptionIndex !== -1) {
        facility.utilities.splice(consumptionIndex, 1);
        return true;
      }
    }
    return false;
  }

  // Utility functions
  function getAvailableRooms(facilityId: string, type?: string) {
    const facility = facilities.value.find(f => f.id === facilityId);
    if (facility) {
      let availableRooms = facility.rooms.filter(r => r.status === 'available');
      if (type) {
        availableRooms = availableRooms.filter(r => r.type === type);
      }
      return availableRooms;
    }
    return [];
  }

  function getUpcomingMaintenances() {
    const upcoming: { facilityId: string, facilityName: string, record: FacilityMaintenanceRecord }[] = [];
    
    facilities.value.forEach(facility => {
      facility.maintenanceRecords.forEach(record => {
        if (record.status === 'scheduled') {
          upcoming.push({
            facilityId: facility.id,
            facilityName: facility.name,
            record
          });
        }
      });
    });
    
    return upcoming;
  }

  function getUtilityConsumptionStats(facilityId: string, type: string, year: number) {
    const facility = facilities.value.find(f => f.id === facilityId);
    if (facility) {
      const consumptions = facility.utilities.filter(u => u.type === type && u.year === year);
      consumptions.sort((a, b) => a.month - b.month);
      
      return {
        readings: consumptions.map(c => c.reading),
        costs: consumptions.map(c => c.cost),
        months: consumptions.map(c => c.month)
      };
    }
    return null;
  }

  return {
    facilities,
    // Facility CRUD
    addFacility,
    updateFacility,
    deleteFacility,
    // Room CRUD
    addRoom,
    updateRoom,
    deleteRoom,
    // Equipment CRUD
    addEquipment,
    updateEquipment,
    deleteEquipment,
    // Reservation CRUD
    addReservation,
    updateReservation,
    deleteReservation,
    // Maintenance CRUD
    addMaintenanceRecord,
    updateMaintenanceRecord,
    deleteMaintenanceRecord,
    // Utility CRUD
    addUtilityConsumption,
    updateUtilityConsumption,
    deleteUtilityConsumption,
    // Utility functions
    getAvailableRooms,
    getUpcomingMaintenances,
    getUtilityConsumptionStats
  };
});