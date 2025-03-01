<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouteStore } from '../stores/routes';
import { useDriverStore } from '../stores/drivers';
import { useVehicleStore } from '../stores/vehicles';

const routeStore = useRouteStore();
const driverStore = useDriverStore();
const vehicleStore = useVehicleStore();

const routes = computed(() => routeStore.routes);

const getRouteStatusLabel = (status: string) => {
  switch (status) {
    case 'planned': return 'Planejada';
    case 'in_progress': return 'Em Andamento';
    case 'completed': return 'Concluída';
    case 'cancelled': return 'Cancelada';
    default: return status;
  }
};

const getRouteStatusClass = (status: string) => {
  switch (status) {
    case 'planned': return 'status-planned';
    case 'in_progress': return 'status-in-progress';
    case 'completed': return 'status-completed';
    case 'cancelled': return 'status-cancelled';
    default: return '';
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const deleteRoute = (id: string) => {
  if (confirm('Tem certeza que deseja excluir esta rota?')) {
    routeStore.deleteRoute(id);
  }
};

const completeRoute = (id: string) => {
  if (confirm('Tem certeza que deseja marcar esta rota como concluída?')) {
    routeStore.completeRoute(id);
  }
};
</script>

<template>
  <div class="routes-page">
    <div class="page-header">
      <h1>Rotas de Entrega</h1>
      <div class="header-actions">
        <router-link to="/fleet/routes/create" class="btn-primary">Nova Rota</router-link>
        <router-link to="/fleet" class="btn-secondary">Voltar para Frota</router-link>
      </div>
    </div>
    
    <div class="routes-list">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Motorista</th>
            <th>Veículo</th>
            <th>Datas</th>
            <th>Destinos</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="route in routes" :key="route.id">
            <td>{{ route.name }}</td>
            <td>{{ route.driverName }}</td>
            <td>{{ route.vehiclePlate }}</td>
            <td>{{ route.startDate }} a {{ route.endDate }}</td>
            <td>{{ route.destinations.length }} destinos</td>
            <td>
              <span :class="['status-badge', getRouteStatusClass(route.status)]">
                {{ getRouteStatusLabel(route.status) }}
              </span>
            </td>
            <td class="actions">
              <router-link :to="`/fleet/routes/${route.id}`" class="btn-view">Ver</router-link>
              <button 
                v-if="route.status === 'in_progress'" 
                @click="completeRoute(route.id)" 
                class="btn-success"
              >
                Concluir
              </button>
              <button @click="deleteRoute(route.id)" class="btn-delete">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.routes-page {
  padding: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

h1 {
  margin: 0;
}

.routes-list {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
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

.status-planned {
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

.btn-success {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}
</style>