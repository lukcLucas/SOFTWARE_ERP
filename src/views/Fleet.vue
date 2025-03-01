<script setup lang="ts">
import { ref, computed } from 'vue';
import { useVehicleStore } from '../stores/vehicles';

const vehicleStore = useVehicleStore();
const vehicles = computed(() => vehicleStore.vehicles);

const getStatusClass = (status: string) => {
  switch (status) {
    case 'available': return 'status-available';
    case 'in_use': return 'status-in-use';
    case 'maintenance': return 'status-maintenance';
    case 'inactive': return 'status-inactive';
    default: return '';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'available': return 'Disponível';
    case 'in_use': return 'Em Uso';
    case 'maintenance': return 'Em Manutenção';
    case 'inactive': return 'Inativo';
    default: return status;
  }
};

const getVehicleTypeLabel = (type: string) => {
  switch (type) {
    case 'car': return 'Carro';
    case 'truck': return 'Caminhão';
    case 'van': return 'Van';
    case 'motorcycle': return 'Moto';
    case 'other': return 'Outro';
    default: return type;
  }
};

const getFuelTypeLabel = (type: string) => {
  switch (type) {
    case 'gasoline': return 'Gasolina';
    case 'diesel': return 'Diesel';
    case 'ethanol': return 'Etanol';
    case 'electric': return 'Elétrico';
    case 'hybrid': return 'Híbrido';
    default: return type;
  }
};
</script>

<template>
  <div class="fleet-page">
    <div class="page-header">
      <h1>Gestão de Frota</h1>
      <router-link to="/fleet/vehicles/create" class="btn-primary">Novo Veículo</router-link>
    </div>
    
    <div class="fleet-stats">
      <div class="stat-card">
        <div class="stat-icon">🚗</div>
        <div class="stat-content">
          <h3>Total de Veículos</h3>
          <p class="stat-value">{{ vehicles.length }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <h3>Disponíveis</h3>
          <p class="stat-value">{{ vehicles.filter(v => v.status === 'available').length }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🔧</div>
        <div class="stat-content">
          <h3>Em Manutenção</h3>
          <p class="stat-value">{{ vehicles.filter(v => v.status === 'maintenance').length }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🚦</div>
        <div class="stat-content">
          <h3>Em Uso</h3>
          <p class="stat-value">{{ vehicles.filter(v => v.status === 'in_use').length }}</p>
        </div>
      </div>
    </div>
    
    <div class="vehicles-container">
      <h2>Veículos</h2>
      <table>
        <thead>
          <tr>
            <th>Placa</th>
            <th>Modelo</th>
            <th>Marca</th>
            <th>Tipo</th>
            <th>Combustível</th>
            <th>Km Atual</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="vehicle in vehicles" :key="vehicle.id">
            <td>{{ vehicle.plate }}</td>
            <td>{{ vehicle.model }}</td>
            <td>{{ vehicle.brand }}</td>
            <td>{{ getVehicleTypeLabel(vehicle.type) }}</td>
            <td>{{ getFuelTypeLabel(vehicle.fuelType) }}</td>
            <td>{{ vehicle.odometer.toLocaleString() }} km</td>
            <td>
              <span :class="['status-badge', getStatusClass(vehicle.status)]">
                {{ getStatusLabel(vehicle.status) }}
              </span>
            </td>
            <td class="actions">
              <router-link :to="`/fleet/vehicles/${vehicle.id}`" class="btn-view">Ver</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="fleet-actions">
      <div class="action-links">
        <router-link to="/fleet/drivers" class="action-link">
          <span class="action-icon">👤</span>
          <span class="action-text">Gerenciar Motoristas</span>
        </router-link>
        
        <router-link to="/fleet/routes" class="action-link">
          <span class="action-icon">🗺️</span>
          <span class="action-text">Gerenciar Rotas</span>
        </router-link>
        
        <router-link to="/fleet/maintenance" class="action-link">
          <span class="action-icon">🔧</span>
          <span class="action-text">Registros de Manutenção</span>
        </router-link>
        
        <router-link to="/fleet/fuel" class="action-link">
          <span class="action-icon">⛽</span>
          <span class="action-text">Controle de Abastecimento</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fleet-page {
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

.fleet-stats {
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

.vehicles-container {
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

.status-available {
  background-color: #c8e6c9;
  color: #388e3c;
}

.status-in-use {
  background-color: #bbdefb;
  color: #1976d2;
}

.status-maintenance {
  background-color: #fff9c4;
  color: #fbc02d;
}

.status-inactive {
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

.fleet-actions {
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