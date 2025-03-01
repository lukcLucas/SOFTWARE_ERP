<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRouteStore } from '../stores/routes';
import { format } from 'date-fns';
import type { RouteDestination } from '../types';

const route = useRoute();
const router = useRouter();
const routeStore = useRouteStore();

const routeId = computed(() => route.params.id as string);
const deliveryRoute = computed(() => {
  return routeStore.routes.find(r => r.id === routeId.value);
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

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

const getDestinationStatusLabel = (status: string) => {
  switch (status) {
    case 'pending': return 'Pendente';
    case 'arrived': return 'Chegou';
    case 'completed': return 'Concluído';
    case 'skipped': return 'Ignorado';
    default: return status;
  }
};

const getDestinationStatusClass = (status: string) => {
  switch (status) {
    case 'pending': return 'status-pending';
    case 'arrived': return 'status-arrived';
    case 'completed': return 'status-completed';
    case 'skipped': return 'status-skipped';
    default: return '';
  }
};

const updateDestinationStatus = (destinationId: string, newStatus: 'pending' | 'arrived' | 'completed' | 'skipped') => {
  if (!deliveryRoute.value) return;
  
  const data: Partial<RouteDestination> = { status: newStatus };
  
  if (newStatus === 'arrived') {
    data.actualArrival = format(new Date(), 'yyyy-MM-dd HH:mm');
  }
  
  routeStore.updateDestination(deliveryRoute.value.id, destinationId, data);
};

const completeRoute = () => {
  if (confirm('Tem certeza que deseja marcar esta rota como concluída?')) {
    if (deliveryRoute.value) {
      routeStore.completeRoute(deliveryRoute.value.id);
    }
  }
};

const deleteRoute = () => {
  if (confirm('Tem certeza que deseja excluir esta rota?')) {
    if (deliveryRoute.value) {
      routeStore.deleteRoute(deliveryRoute.value.id);
      router.push('/fleet/routes');
    }
  }
};

// Add destination form
const showDestinationForm = ref(false);
const newDestination = ref<Omit<RouteDestination, 'id'>>({
  address: '',
  scheduledArrival: format(new Date(), 'yyyy-MM-dd HH:mm'),
  status: 'pending',
  notes: '',
  order: 0
});

const resetDestinationForm = () => {
  if (!deliveryRoute.value) return;
  
  newDestination.value = {
    address: '',
    scheduledArrival: format(new Date(), 'yyyy-MM-dd HH:mm'),
    status: 'pending',
    notes: '',
    order: deliveryRoute.value.destinations.length + 1
  };
};

const openDestinationForm = () => {
  resetDestinationForm();
  showDestinationForm.value = true;
};

const saveDestination = () => {
  if (!deliveryRoute.value) return;
  
  routeStore.addDestination(deliveryRoute.value.id, newDestination.value);
  showDestinationForm.value = false;
  resetDestinationForm();
};
</script>

<template>
  <div class="route-detail" v-if="deliveryRoute">
    <div class="page-header">
      <div>
        <h1>{{ deliveryRoute.name }}</h1>
        <span :class="['status-badge', getRouteStatusClass(deliveryRoute.status)]">
          {{ getRouteStatusLabel(deliveryRoute.status) }}
        </span>
      </div>
      <div class="header-actions">
        <button @click="deleteRoute" class="btn-delete">Excluir</button>
        <button 
          v-if="deliveryRoute.status === 'in_progress'" 
          @click="completeRoute" 
          class="btn-success"
        >
          Concluir Rota
        </button>
      </div>
    </div>
    
    <div class="route-info">
      <div class="info-section">
        <h3>Informações da Rota</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Motorista:</span>
            <span class="info-value">{{ deliveryRoute.driverName }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Veículo:</span>
            <span class="info-value">{{ deliveryRoute.vehiclePlate }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Data de Início:</span>
            <span class="info-value">{{ deliveryRoute.startDate }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Data de Término:</span>
            <span class="info-value">{{ deliveryRoute.endDate }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Distância Total:</span>
            <span class="info-value">{{ deliveryRoute.totalDistance }} km</span>
          </div>
          <div class="info-item">
            <span class="info-label">Custo Estimado:</span>
            <span class="info-value">{{ formatCurrency(deliveryRoute.estimatedFuelCost) }}</span>
          </div>
        </div>
      </div>
      
      <div class="info-section">
        <h3>Descrição</h3>
        <p>{{ deliveryRoute.description || 'Sem descrição' }}</p>
      </div>
      
      <div class="info-section">
        <h3>Ponto de Partida</h3>
        <p>{{ deliveryRoute.startingPoint }}</p>
      </div>
    </div>
    
    <div class="destinations-section">
      <div class="section-header">
        <h3>Destinos</h3>
        <button 
          v-if="deliveryRoute.status === 'in_progress'" 
          @click="openDestinationForm" 
          class="btn-add"
        >
          Adicionar Destino
        </button>
      </div>
      
      <div v-if="showDestinationForm" class="form-container">
        <h4>Adicionar Destino</h4>
        <form @submit.prevent="saveDestination">
          <div class="form-group">
            <label for="destinationAddress">Endereço</label>
            <input type="text" id="destinationAddress" v-model="newDestination.address" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="scheduledArrival">Horário Previsto</label>
              <input type="datetime-local" id="scheduledArrival" v-model="newDestination.scheduledArrival" required>
            </div>
            <div class="form-group">
              <label for="destinationOrder">Ordem</label>
              <input type="number" id="destinationOrder" v-model="newDestination.order" min="1" required>
            </div>
          </div>
          <div class="form-group">
            <label for="destinationNotes">Observações</label>
            <textarea id="destinationNotes" v-model="newDestination.notes"></textarea>
          </div>
          <div class="form-actions">
            <button type="button" @click="showDestinationForm = false" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary">Salvar</button>
          </div>
        </form>
      </div>
      
      <table v-if="deliveryRoute.destinations.length > 0">
        <thead>
          <tr>
            <th>Ordem</th>
            <th>Endereço</th>
            <th>Horário Previsto</th>
            <th>Horário Real</th>
            <th>Status</th>
            <th>Observações</th>
            <th v-if="deliveryRoute.status === 'in_progress'">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="destination in deliveryRoute.destinations" :key="destination.id">
            <td>{{ destination.order }}</td>
            <td>{{ destination.address }}</td>
            <td>{{ destination.scheduledArrival }}</td>
            <td>{{ destination.actualArrival || '-' }}</td>
            <td>
              <span :class="['status-badge', getDestinationStatusClass(destination.status)]">
                {{ getDestinationStatusLabel(destination.status) }}
              </span>
            </td>
            <td>{{ destination.notes || '-' }}</td>
            <td v-if="deliveryRoute.status === 'in_progress'" class="actions">
              <button 
                v-if="destination.status === 'pending'" 
                @click="updateDestinationStatus(destination.id, 'arrived')" 
                class="btn-action"
              >
                Chegou
              </button>
              <button 
                v-if="destination.status === 'arrived'" 
                @click="updateDestinationStatus(destination.id, 'completed')" 
                class="btn-success"
              >
                Concluir
              </button>
              <button 
                v-if="destination.status === 'pending'" 
                @click="updateDestinationStatus(destination.id, 'skipped')" 
                class="btn-warning"
              >
                Ignorar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">
        <p>Nenhum destino cadastrado para esta rota.</p>
      </div>
    </div>
  </div>
  <div v-else class="not-found">
    <h2>Rota não encontrada</h2>
    <router-link to="/fleet/routes" class="btn-primary">Voltar para Rotas</router-link>
  </div>
</template>

<style scoped>
.route-detail {
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
  margin: 0 0 0.5rem 0;
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

.status-pending {
  background-color: #e0e0e0;
  color: #616161;
}

.status-arrived {
  background-color: #bbdefb;
  color: #1976d2;
}

.status-completed {
  background-color: #c8e6c9;
  color: #388e3c;
}

.status-skipped {
  background-color: #ffcdd2;
  color: #d32f2f;
}

.route-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.info-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.info-section h3 {
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
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.2rem;
}

.info-value {
  font-weight: 500;
}

.destinations-section {
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
}

.form-container {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-container h4 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  flex: 1;
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input, select, textarea {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
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

.actions {
  display: flex;
  gap: 0.5rem;
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
}

.btn-action {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}
</style>