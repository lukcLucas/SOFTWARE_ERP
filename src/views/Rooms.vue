<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useFacilityStore } from '../stores/facilities';

const route = useRoute();
const facilityStore = useFacilityStore();

const facilityId = computed(() => route.params.facilityId as string);
const facility = computed(() => {
  return facilityStore.facilities.find(f => f.id === facilityId.value);
});

const rooms = computed(() => {
  if (!facility.value) return [];
  return facility.value.rooms;
});

const getRoomStatusClass = (status: string) => {
  switch (status) {
    case 'available': return 'status-available';
    case 'occupied': return 'status-occupied';
    case 'maintenance': return 'status-maintenance';
    case 'reserved': return 'status-reserved';
    default: return '';
  }
};

const getRoomStatusLabel = (status: string) => {
  switch (status) {
    case 'available': return 'Disponível';
    case 'occupied': return 'Ocupada';
    case 'maintenance': return 'Em Manutenção';
    case 'reserved': return 'Reservada';
    default: return status;
  }
};

const getRoomTypeLabel = (type: string) => {
  switch (type) {
    case 'meeting': return 'Sala de Reunião';
    case 'office': return 'Escritório';
    case 'storage': return 'Armazenamento';
    case 'common': return 'Área Comum';
    case 'other': return 'Outro';
    default: return type;
  }
};
</script>

<template>
  <div class="rooms-page" v-if="facility">
    <div class="page-header">
      <div>
        <h1>Salas - {{ facility.name }}</h1>
        <p class="facility-address">{{ facility.address }}</p>
      </div>
      <div class="header-actions">
        <router-link :to="`/facilities/${facilityId}/rooms/create`" class="btn-primary">Nova Sala</router-link>
        <router-link :to="`/facilities/${facilityId}`" class="btn-secondary">Voltar para Instalação</router-link>
      </div>
    </div>
    
    <div class="rooms-container">
      <table v-if="rooms.length > 0">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Andar</th>
            <th>Capacidade</th>
            <th>Equipamentos</th>
            <th>Reservas</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="room in rooms" :key="room.id">
            <td>{{ room.name }}</td>
            <td>{{ getRoomTypeLabel(room.type) }}</td>
            <td>{{ room.floor }}</td>
            <td>{{ room.capacity > 0 ? room.capacity + ' pessoas' : 'N/A' }}</td>
            <td>{{ room.equipment.length }}</td>
            <td>{{ room.reservations.length }}</td>
            <td>
              <span :class="['status-badge', getRoomStatusClass(room.status)]">
                {{ getRoomStatusLabel(room.status) }}
              </span>
            </td>
            <td class="actions">
              <router-link :to="`/facilities/${facilityId}/rooms/${room.id}`" class="btn-view">Ver</router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">
        <p>Nenhuma sala cadastrada para esta instalação.</p>
        <router-link :to="`/facilities/${facilityId}/rooms/create`" class="btn-primary">Adicionar Sala</router-link>
      </div>
    </div>
  </div>
  <div v-else class="not-found">
    <h2>Instalação não encontrada</h2>
    <router-link to="/facilities" class="btn-primary">Voltar para Instalações</router-link>
  </div>
</template>

<style scoped>
.rooms-page {
  padding: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

h1 {
  margin: 0;
}

.facility-address {
  color: #666;
  margin-top: 0.5rem;
}

.rooms-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.8rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

th {
  background-color: #f5f5f5;
  font-weight: 600;
}

.status-badge {
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-available {
  background-color: #c8e6c9;
  color: #388e3c;
}

.status-occupied {
  background-color: #bbdefb;
  color: #1976d2;
}

.status-maintenance {
  background-color: #fff9c4;
  color: #fbc02d;
}

.status-reserved {
  background-color: #e0e0e0;
  color: #616161;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-primary {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
}

.btn-secondary {
  background-color: #e0e0e0;
  color: #333;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
}

.btn-view {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  text-decoration: none;
}

.empty-state {
  padding: 2rem;
  text-align: center;
}

.not-found {
  padding: 2rem;
  text-align: center;
}
</style>