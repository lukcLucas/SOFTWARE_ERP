<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFacilityStore } from '../stores/facilities';
import type { Room, FacilityMaintenanceRecord, UtilityConsumption } from '../types';

const route = useRoute();
const router = useRouter();
const facilityStore = useFacilityStore();

const facilityId = computed(() => route.params.id as string);
const facility = computed(() => {
  return facilityStore.facilities.find(f => f.id === facilityId.value);
});

// Status helpers
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

// Maintenance helpers
const getMaintenanceStatusClass = (status: string) => {
  switch (status) {
    case 'scheduled': return 'status-scheduled';
    case 'in_progress': return 'status-in-progress';
    case 'completed': return 'status-completed';
    case 'cancelled': return 'status-cancelled';
    default: return '';
  }
};

const getMaintenanceStatusLabel = (status: string) => {
  switch (status) {
    case 'scheduled': return 'Agendada';
    case 'in_progress': return 'Em Andamento';
    case 'completed': return 'Concluída';
    case 'cancelled': return 'Cancelada';
    default: return status;
  }
};

const getMaintenanceTypeLabel = (type: string) => {
  switch (type) {
    case 'preventive': return 'Preventiva';
    case 'corrective': return 'Corretiva';
    case 'inspection': return 'Inspeção';
    case 'emergency': return 'Emergência';
    default: return type;
  }
};

// Utility consumption helpers
const getUtilityTypeLabel = (type: string) => {
  switch (type) {
    case 'electricity': return 'Eletricidade';
    case 'water': return 'Água';
    case 'gas': return 'Gás';
    case 'internet': return 'Internet';
    case 'other': return 'Outro';
    default: return type;
  }
};

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Update facility status
const updateStatus = (newStatus: 'active' | 'inactive' | 'under_maintenance' | 'under_construction') => {
  if (facility.value) {
    facilityStore.updateFacility(facility.value.id, { status: newStatus });
  }
};

// Delete facility
const deleteFacility = () => {
  if (confirm('Tem certeza que deseja excluir esta instalação?')) {
    if (facility.value) {
      facilityStore.deleteFacility(facility.value.id);
      router.push('/facilities');
    }
  }
};
</script>

<template>
  <div class="facility-detail" v-if="facility">
    <div class="page-header">
      <div>
        <h1>{{ facility.name }}</h1>
        <span :class="['status-badge', getStatusClass(facility.status)]">
          {{ getStatusLabel(facility.status) }}
        </span>
      </div>
      <div class="header-actions">
        <button @click="deleteFacility" class="btn-delete">Excluir</button>
        <div class="status-actions">
          <button 
            v-if="facility.status !== 'active'" 
            @click="updateStatus('active')" 
            class="btn-success"
          >
            Marcar como Ativa
          </button>
          <button 
            v-if="facility.status !== 'under_maintenance'" 
            @click="updateStatus('under_maintenance')" 
            class="btn-warning"
          >
            Em Manutenção
          </button>
          <button 
            v-if="facility.status !== 'inactive'" 
            @click="updateStatus('inactive')" 
            class="btn-secondary"
          >
            Desativar
          </button>
        </div>
      </div>
    </div>
    
    <div class="facility-overview">
      <div class="overview-card">
        <h3>Informações Gerais</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Nome:</span>
            <span class="info-value">{{ facility.name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Tipo:</span>
            <span class="info-value">{{ getFacilityTypeLabel(facility.type) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Endereço:</span>
            <span class="info-value">{{ facility.address }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Tamanho:</span>
            <span class="info-value">{{ facility.size }} m²</span>
          </div>
          <div class="info-item">
            <span class="info-label">Andares:</span>
            <span class="info-value">{{ facility.floors }}</span>
          </div>
        </div>
      </div>
      
      <div class="overview-card">
        <h3>Estatísticas</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Total de Salas:</span>
            <span class="info-value">{{ facility.rooms.length }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Salas Disponíveis:</span>
            <span class="info-value">{{ facility.rooms.filter(r => r.status === 'available').length }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Manutenções Agendadas:</span>
            <span class="info-value">{{ facility.maintenanceRecords.filter(m => m.status === 'scheduled').length }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Rooms Section -->
    <div class="facility-section">
      <div class="section-header">
        <h3>Salas</h3>
        <div class="header-actions">
          <router-link :to="`/facilities/${facility.id}/rooms`" class="btn-primary">Ver Todas</router-link>
          <router-link :to="`/facilities/${facility.id}/rooms/create`" class="btn-add">Adicionar Sala</router-link>
        </div>
      </div>
      
      <table v-if="facility.rooms.length > 0">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Andar</th>
            <th>Capacidade</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="room in facility.rooms.slice(0, 5)" :key="room.id">
            <td>{{ room.name }}</td>
            <td>{{ getRoomTypeLabel(room.type) }}</td>
            <td>{{ room.floor }}</td>
            <td>{{ room.capacity > 0 ? room.capacity + ' pessoas' : 'N/A' }}</td>
            <td>
              <span :class="['status-badge', getRoomStatusClass(room.status)]">
                {{ getRoomStatusLabel(room.status) }}
              </span>
            </td>
            <td class="actions">
              <router-link :to="`/facilities/${facility.id}/rooms/${room.id}`" class="btn-view">Ver</router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">
        <p>Nenhuma sala cadastrada para esta instalação.</p>
      </div>
    </div>
    
    <!-- Maintenance Section -->
    <div class="facility-section">
      <div class="section-header">
        <h3>Manutenções</h3>
        <div class="header-actions">
          <router-link :to="`/facilities/${facility.id}/maintenance`" class="btn-primary">Ver Todas</router-link>
          <router-link :to="`/facilities/${facility.id}/maintenance/create`" class="btn-add">Agendar Manutenção</router-link>
        </div>
      </div>
      
      <table v-if="facility.maintenanceRecords.length > 0">
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipo</th>
            <th>Descrição</th>
            <th>Área</th>
            <th>Custo</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in facility.maintenanceRecords.slice(0, 5)" :key="record.id">
            <td>{{ record.date }}</td>
            <td>{{ getMaintenanceTypeLabel(record.type) }}</td>
            <td>{{ record.description }}</td>
            <td>{{ record.area }}</td>
            <td>{{ formatCurrency(record.cost) }}</td>
            <td>
              <span :class="['status-badge', getMaintenanceStatusClass(record.status)]">
                {{ getMaintenanceStatusLabel(record.status) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">
        <p>Nenhum registro de manutenção para esta instalação.</p>
      </div>
    </div>
    
    <!-- Utility Consumption Section -->
    <div class="facility-section">
      <div class="section-header">
        <h3>Consumo de Recursos</h3>
        <div class="header-actions">
          <router-link :to="`/facilities/${facility.id}/utilities`" class="btn-primary">Ver Todos</router-link>
        </div>
      </div>
      
      <table v-if="facility.utilities.length > 0">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Período</th>
            <th>Leitura</th>
            <th>Custo</th>
            <th>Observações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="utility in facility.utilities.slice(0, 5)" :key="utility.id">
            <td>{{ getUtilityTypeLabel(utility.type) }}</td>
            <td>{{ utility.month }}/{{ utility.year }}</td>
            <td>{{ utility.reading }} {{ utility.unit }}</td>
            <td>{{ formatCurrency(utility.cost) }}</td>
            <td>{{ utility.notes || '-' }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">
        <p>Nenhum registro de consumo para esta instalação.</p>
      </div>
    </div>
  </div>
  <div v-else class="not-found">
    <h2>Instalação não encontrada</h2>
    <router-link to="/facilities" class="btn-primary">Voltar para Instalações</router-link>
  </div>
</template>

<style scoped>
.facility-detail {
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

.status-available {
  background-color: #c8e6c9;
  color: #388e3c;
}

.status-occupied {
  background-color: #bbdefb;
  color: #1976d2;
}

.status-reserved {
  background-color: #fff9c4;
  color: #fbc02d;
}

.status-scheduled {
  background-color: #e0e0e0;
  color: #616161;
}

.status-in-progress {
  background-color: #bbdefb;
  color: #1976d2;
}

.status-completed {
  background-color: #c8e6c9;
  color: #388e3c;
}

.status-cancelled {
  background-color: #ffcdd2;
  color: #d32f2f;
}

.facility-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.overview-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.overview-card h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.2rem;
}

.info-value {
  font-weight: 500;
}

.facility-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
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
}

.btn-secondary {
  background-color: #e0e0e0;
  color: #333;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
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

.btn-delete {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-add {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
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