<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDriverStore } from '../stores/drivers';
import { useVehicleStore } from '../stores/vehicles';
import { format } from 'date-fns';

const route = useRoute();
const router = useRouter();
const driverStore = useDriverStore();
const vehicleStore = useVehicleStore();

const driverId = computed(() => route.params.id as string);
const driver = computed(() => {
  return driverStore.drivers.find(d => d.id === driverId.value);
});

const assignedVehicles = computed(() => {
  return vehicleStore.vehicles.filter(v => v.assignedDriverId === driverId.value);
});

const getStatusClass = (status: string) => {
  switch (status) {
    case 'available': return 'status-available';
    case 'on_route': return 'status-on-route';
    case 'off_duty': return 'status-off-duty';
    case 'inactive': return 'status-inactive';
    default: return '';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'available': return 'Disponível';
    case 'on_route': return 'Em Rota';
    case 'off_duty': return 'Fora de Serviço';
    case 'inactive': return 'Inativo';
    default: return status;
  }
};

const deleteDriver = () => {
  if (confirm('Tem certeza que deseja excluir este motorista?')) {
    if (driver.value) {
      driverStore.deleteDriver(driver.value.id);
      router.push('/fleet/drivers');
    }
  }
};

// Update driver status
const updateStatus = (newStatus: 'available' | 'on_route' | 'off_duty' | 'inactive') => {
  if (driver.value) {
    driverStore.updateDriver(driver.value.id, { status: newStatus });
  }
};

// Trip history
const tripHistory = computed(() => {
  if (!driver.value) return [];
  return driverStore.getDriverTrips(driver.value.id);
});

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'dd/MM/yyyy');
};
</script>

<template>
  <div class="driver-detail" v-if="driver">
    <div class="page-header">
      <div>
        <h1>{{ driver.name }}</h1>
        <span :class="['status-badge', getStatusClass(driver.status)]">
          {{ getStatusLabel(driver.status) }}
        </span>
      </div>
      <div class="header-actions">
        <button @click="deleteDriver" class="btn-delete">Excluir</button>
        <router-link :to="`/fleet/drivers/${driver.id}/edit`" class="btn-edit">Editar</router-link>
        <div class="status-actions">
          <button 
            v-if="driver.status !== 'available'" 
            @click="updateStatus('available')" 
            class="btn-success"
          >
            Marcar como Disponível
          </button>
          <button 
            v-if="driver.status !== 'on_route'" 
            @click="updateStatus('on_route')" 
            class="btn-primary"
          >
            Marcar como Em Rota
          </button>
          <button 
            v-if="driver.status !== 'off_duty'" 
            @click="updateStatus('off_duty')" 
            class="btn-warning"
          >
            Marcar como Fora de Serviço
          </button>
        </div>
      </div>
    </div>
    
    <div class="driver-info-grid">
      <div class="info-card">
        <h3>Informações Pessoais</h3>
        <div class="info-item">
          <span class="info-label">Nome:</span>
          <span class="info-value">{{ driver.name }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Email:</span>
          <span class="info-value">{{ driver.email }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Telefone:</span>
          <span class="info-value">{{ driver.phone }}</span>
        </div>
      </div>
      
      <div class="info-card">
        <h3>Informações da CNH</h3>
        <div class="info-item">
          <span class="info-label">Número:</span>
          <span class="info-value">{{ driver.licenseNumber }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Categoria:</span>
          <span class="info-value">{{ driver.licenseType }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Validade:</span>
          <span class="info-value">{{ formatDate(driver.licenseExpiration) }}</span>
        </div>
      </div>
    </div>
    
    <div class="section-container">
      <h3>Veículos Atribuídos</h3>
      <div v-if="assignedVehicles.length > 0">
        <table>
          <thead>
            <tr>
              <th>Placa</th>
              <th>Modelo</th>
              <th>Marca</th>
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="vehicle in assignedVehicles" :key="vehicle.id">
              <td>{{ vehicle.plate }}</td>
              <td>{{ vehicle.model }}</td>
              <td>{{ vehicle.brand }}</td>
              <td>{{ vehicle.type }}</td>
              <td>
                <router-link :to="`/fleet/vehicles/${vehicle.id}`" class="btn-view">Ver</router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="empty-state">
        <p>Nenhum veículo atribuído a este motorista.</p>
      </div>
    </div>
    
    <div class="section-container">
      <h3>Histórico de Viagens</h3>
      <div v-if="tripHistory.length > 0">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Origem</th>
              <th>Destino</th>
              <th>Distância</th>
              <th>Veículo</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="trip in tripHistory" :key="trip.id">
              <td>{{ formatDate(trip.date) }}</td>
              <td>{{ trip.origin }}</td>
              <td>{{ trip.destination }}</td>
              <td>{{ trip.distance }} km</td>
              <td>{{ trip.vehiclePlate }}</td>
              <td>{{ trip.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="empty-state">
        <p>Nenhuma viagem registrada para este motorista.</p>
      </div>
    </div>
  </div>
  <div v-else class="not-found">
    <h2>Motorista não encontrado</h2>
    <router-link to="/fleet/drivers" class="btn-primary">Voltar para Motoristas</router-link>
  </div>
</template>

<style scoped>
.driver-detail {
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

.status-actions {
  display: flex;
  gap: 0.5rem;
}

h1 {
  margin: 0 0 0.5rem 0;
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

.status-on-route {
  background-color: #bbdefb;
  color: #1976d2;
}

.status-off-duty {
  background-color: #fff9c4;
  color: #fbc02d;
}

.status-inactive {
  background-color: #e0e0e0;
  color: #616161;
}

.driver-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.info-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.info-card h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.info-item {
  display: flex;
  margin-bottom: 0.5rem;
}

.info-label {
  font-weight: 500;
  width: 100px;
}

.section-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.section-container h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.2rem;
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

.empty-state {
  background-color: #f9f9f9;
  padding: 1.5rem;
  text-align: center;
  border-radius: 4px;
}

.not-found {
  padding: 2rem;
  text-align: center;
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
}

.btn-success {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-warning {
  background-color: #f39c12;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-edit {
  background-color: #f39c12;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
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
</style>