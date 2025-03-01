<script setup lang="ts">
import { ref, computed } from 'vue';
import { useFacilityStore } from '../stores/facilities';
import type { Facility } from '../types';

const facilityStore = useFacilityStore();
const facilities = computed(() => facilityStore.facilities);

const getStatusClass = (status: string) => {
  switch (status) {
    case 'active': return 'status-active';
    case 'inactive': return 'status-inactive';
    case 'under_maintenance': return 'status-maintenance';
    case 'under_construction': return 'status-construction';
    default: return '';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active': return 'Ativa';
    case 'inactive': return 'Inativa';
    case 'under_maintenance': return 'Em Manutenção';
    case 'under_construction': return 'Em Construção';
    default: return status;
  }
};

const getFacilityTypeLabel = (type: string) => {
  switch (type) {
    case 'office': return 'Escritório';
    case 'warehouse': return 'Depósito';
    case 'retail': return 'Loja';
    case 'other': return 'Outro';
    default: return type;
  }
};

const getTotalRooms = (facility: Facility) => {
  return facility.rooms.length;
};

const getAvailableRooms = (facility: Facility) => {
  return facility.rooms.filter(room => room.status === 'available').length;
};

const getUpcomingMaintenances = (facility: Facility) => {
  return facility.maintenanceRecords.filter(record => record.status === 'scheduled').length;
};
</script>

<template>
  <div class="facilities-page">
    <div class="page-header">
      <h1>Gestão de Facilities</h1>
      <router-link to="/facilities/create" class="btn-primary">Nova Instalação</router-link>
    </div>
    
    <div class="facilities-stats">
      <div class="stat-card">
        <div class="stat-icon">🏢</div>
        <div class="stat-content">
          <h3>Total de Instalações</h3>
          <p class="stat-value">{{ facilities.length }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <h3>Instalações Ativas</h3>
          <p class="stat-value">{{ facilities.filter(f => f.status === 'active').length }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🔧</div>
        <div class="stat-content">
          <h3>Em Manutenção</h3>
          <p class="stat-value">{{ facilities.filter(f => f.status === 'under_maintenance').length }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🚧</div>
        <div class="stat-content">
          <h3>Em Construção</h3>
          <p class="stat-value">{{ facilities.filter(f => f.status === 'under_construction').length }}</p>
        </div>
      </div>
    </div>
    
    <div class="facilities-container">
      <h2>Instalações</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Endereço</th>
            <th>Tamanho</th>
            <th>Salas</th>
            <th>Manutenções</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="facility in facilities" :key="facility.id">
            <td>{{ facility.name }}</td>
            <td>{{ getFacilityTypeLabel(facility.type) }}</td>
            <td>{{ facility.address }}</td>
            <td>{{ facility.size }} m²</td>
            <td>{{ getTotalRooms(facility) }} ({{ getAvailableRooms(facility) }} disponíveis)</td>
            <td>{{ getUpcomingMaintenances(facility) }} agendadas</td>
            <td>
              <span :class="['status-badge', getStatusClass(facility.status)]">
                {{ getStatusLabel(facility.status) }}
              </span>
            </td>
            <td class="actions">
              <router-link :to="`/facilities/${facility.id}`" class="btn-view">Ver</router-link>
              <router-link :to="`/facilities/${facility.id}/rooms`" class="btn-rooms">Salas</router-link>
              <router-link :to="`/facilities/${facility.id}/maintenance`" class="btn-maintenance">Manutenção</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="facilities-actions">
      <div class="action-links">
        <router-link to="/facilities/create" class="action-link">
          <span class="action-icon">➕</span>
          <span class="action-text">Nova Instalação</span>
        </router-link>
        
        <router-link to="/facilities" class="action-link">
          <span class="action-icon">📅</span>
          <span class="action-text">Reservas de Salas</span>
        </router-link>
        
        <router-link to="/facilities" class="action-link">
          <span class="action-icon">🔧</span>
          <span class="action-text">Manutenções Agendadas</span>
        </router-link>
        
        <router-link to="/facilities" class="action-link">
          <span class="action-icon">⚡</span>
          <span class="action-text">Consumo de Recursos</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.facilities-page {
  padding: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

h1, h2 {
  margin: 0;
}

h2 {
  margin-bottom: 1rem;
}

.facilities-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  align-items: center;
}

.stat-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  margin: 0;
  font-size: 1rem;
  color: #666;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0.5rem 0 0;
}

.facilities-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
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

.status-active {
  background-color: #c8e6c9;
  color: #388e3c;
}

.status-inactive {
  background-color: #e0e0e0;
  color: #616161;
}

.status-maintenance {
  background-color: #fff9c4;
  color: #fbc02d;
}

.status-construction {
  background-color: #ffcdd2;
  color: #d32f2f;
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

.btn-rooms {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  text-decoration: none;
}

.btn-maintenance {
  background-color: #ff9800;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  text-decoration: none;
}

.facilities-actions {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.action-links {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.action-link {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #f5f7fa;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  transition: background-color 0.2s;
}

.action-link:hover {
  background-color: #e8f0fe;
}

.action-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
}

.action-text {
  font-weight: 500;
}
</style>