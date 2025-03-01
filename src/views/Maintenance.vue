<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useFacilityStore } from '../stores/facilities';
import { format } from 'date-fns';

const route = useRoute();
const facilityStore = useFacilityStore();

const facilityId = computed(() => route.params.facilityId as string);
const facility = computed(() => {
  return facilityStore.facilities.find(f => f.id === facilityId.value);
});

const maintenanceRecords = computed(() => {
  if (!facility.value) return [];
  return facility.value.maintenanceRecords;
});

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

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
</script>

<template>
  <div class="maintenance-page" v-if="facility">
    <div class="page-header">
      <div>
        <h1>Manutenções - {{ facility.name }}</h1>
        <p class="facility-address">{{ facility.address }}</p>
      </div>
      <div class="header-actions">
        <router-link :to="`/facilities/${facilityId}/maintenance/create`" class="btn-primary">Nova Manutenção</router-link>
        <router-link :to="`/facilities/${facilityId}`" class="btn-secondary">Voltar para Instalação</router-link>
      </div>
    </div>
    
    <div class="maintenance-stats">
      <div class="stat-card">
        <div class="stat-icon">🔧</div>
        <div class="stat-content">
          <h3>Total de Manutenções</h3>
          <p class="stat-value">{{ maintenanceRecords.length }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-content">
          <h3>Agendadas</h3>
          <p class="stat-value">{{ maintenanceRecords.filter(r => r.status === 'scheduled').length }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">⚙️</div>
        <div class="stat-content">
          <h3>Em Andamento</h3>
          <p class="stat-value">{{ maintenanceRecords.filter(r => r.status === 'in_progress').length }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <h3>Concluídas</h3>
          <p class="stat-value">{{ maintenanceRecords.filter(r => r.status === 'completed').length }}</p>
        </div>
      </div>
    </div>
    
    <div class="maintenance-container">
      <table v-if="maintenanceRecords.length > 0">
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipo</th>
            <th>Descrição</th>
            <th>Área</th>
            <th>Fornecedor</th>
            <th>Custo</th>
            <th>Status</th>
            <th>Conclusão</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in maintenanceRecords" :key="record.id">
            <td>{{ record.date }}</td>
            <td>{{ getMaintenanceTypeLabel(record.type) }}</td>
            <td>{{ record.description }}</td>
            <td>{{ record.area }}</td>
            <td>{{ record.provider }}</td>
            <td>{{ formatCurrency(record.cost) }}</td>
            <td>
              <span :class="['status-badge', getMaintenanceStatusClass(record.status)]">
                {{ getMaintenanceStatusLabel(record.status) }}
              </span>
            </td>
            <td>{{ record.completionDate || '-' }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">
        <p>Nenhum registro de manutenção para esta instalação.</p>
        <router-link :to="`/facilities/${facilityId}/maintenance/create`" class="btn-primary">Agendar Manutenção</router-link>
      </div>
    </div>
  </div>
  <div v-else class="not-found">
    <h2>Instalação não encontrada</h2>
    <router-link to="/facilities" class="btn-primary">Voltar para Instalações</router-link>
  </div>
</template>

<style scoped>
.maintenance-page {
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

.maintenance-stats {
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

.maintenance-container {
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

.empty-state {
  padding: 2rem;
  text-align: center;
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
</style>