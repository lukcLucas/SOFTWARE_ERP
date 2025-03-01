<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useRouteStore } from '../stores/routes';
import { useDriverStore } from '../stores/drivers';
import { useVehicleStore } from '../stores/vehicles';
import { format } from 'date-fns';
import type { RouteDestination } from '../types';

const router = useRouter();
const routeStore = useRouteStore();
const driverStore = useDriverStore();
const vehicleStore = useVehicleStore();

const availableDrivers = computed(() => driverStore.getDriversByStatus('available'));
const availableVehicles = computed(() => vehicleStore.getVehiclesByStatus('available'));

// Route form data
const routeName = ref('');
const routeDescription = ref('');
const startDate = ref(format(new Date(), 'yyyy-MM-dd'));
const endDate = ref(format(new Date(), 'yyyy-MM-dd'));
const selectedDriverId = ref('');
const selectedVehicleId = ref('');
const startingPoint = ref('');
const totalDistance = ref(0);
const estimatedFuelCost = ref(0);

// Destination form data
const destinations = ref<Omit<RouteDestination, 'id'>[]>([]);
const destinationAddress = ref('');
const scheduledArrival = ref(format(new Date(), 'yyyy-MM-dd HH:mm'));
const destinationNotes = ref('');
const destinationOrder = ref(1);

const addDestination = () => {
  if (!destinationAddress.value) return;
  
  destinations.value.push({
    address: destinationAddress.value,
    scheduledArrival: scheduledArrival.value,
    status: 'pending',
    notes: destinationNotes.value,
    order: destinationOrder.value
  });
  
  // Sort destinations by order
  destinations.value.sort((a, b) => a.order - b.order);
  
  // Reset form
  destinationAddress.value = '';
  scheduledArrival.value = format(new Date(), 'yyyy-MM-dd HH:mm');
  destinationNotes.value = '';
  destinationOrder.value = destinations.value.length + 1;
};

const removeDestination = (index: number) => {
  destinations.value.splice(index, 1);
  
  // Update order for remaining destinations
  destinations.value.forEach((dest, i) => {
    dest.order = i + 1;
  });
  
  destinationOrder.value = destinations.value.length + 1;
};

const calculateFuelCost = () => {
  if (!selectedVehicleId.value || totalDistance.value <= 0) return 0;
  
  const vehicle = vehicleStore.vehicles.find(v => v.id === selectedVehicleId.value);
  if (!vehicle) return 0;
  
  // Assuming average fuel price of R$ 5.00 per liter
  const fuelPrice = 5.0;
  const fuelEfficiency = vehicle.fuelEfficiency || 10; // km/L
  
  const fuelNeeded = totalDistance.value / fuelEfficiency;
  return fuelNeeded * fuelPrice;
};

const updateFuelCost = () => {
  estimatedFuelCost.value = calculateFuelCost();
};

const saveRoute = () => {
  if (!routeName.value || !selectedDriverId.value || !selectedVehicleId.value || destinations.value.length === 0) {
    alert('Por favor, preencha todos os campos obrigatórios e adicione pelo menos um destino.');
    return;
  }

  const driver = driverStore.drivers.find(d => d.id === selectedDriverId.value);
  const vehicle = vehicleStore.vehicles.find(v => v.id === selectedVehicleId.value);
  
  if (!driver || !vehicle) return;

  const newRoute = {
    name: routeName.value,
    description: routeDescription.value,
    startDate: startDate.value,
    endDate: endDate.value,
    status: 'in_progress' as const,
    driverId: driver.id,
    driverName: driver.name,
    vehicleId: vehicle.id,
    vehiclePlate: vehicle.plate,
    startingPoint: startingPoint.value,
    destinations: destinations.value.map(dest => ({
      ...dest,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    })),
    totalDistance: totalDistance.value,
    estimatedFuelCost: estimatedFuelCost.value
  };

  routeStore.addRoute(newRoute);
  router.push('/fleet/routes');
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
</script>

<template>
  <div class="create-route">
    <div class="page-header">
      <h1>Nova Rota</h1>
    </div>
    
    <div class="route-form">
      <div class="form-section">
        <h3>Informações Básicas</h3>
        
        <div class="form-group">
          <label for="routeName">Nome da Rota</label>
          <input type="text" id="routeName" v-model="routeName" required>
        </div>
        
        <div class="form-group">
          <label for="routeDescription">Descrição</label>
          <textarea id="routeDescription" v-model="routeDescription"></textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="startDate">Data de Início</label>
            <input type="date" id="startDate" v-model="startDate" required>
          </div>
          
          <div class="form-group">
            <label for="endDate">Data de Término</label>
            <input type="date" id="endDate" v-model="endDate" required>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="driver">Motorista</label>
            <select id="driver" v-model="selectedDriverId" required>
              <option value="" disabled>Selecione um motorista</option>
              <option v-for="driver in availableDrivers" :key="driver.id" :value="driver.id">
                {{ driver.name }} ({{ driver.licenseType }})
              </option>
            </select>
            <div v-if="availableDrivers.length === 0" class="form-warning">
              Não há motoristas disponíveis. <router-link to="/fleet/drivers">Adicionar motorista</router-link>
            </div>
          </div>
          
          <div class="form-group">
            <label for="vehicle">Veículo</label>
            <select id="vehicle" v-model="selectedVehicleId" @change="updateFuelCost" required>
              <option value="" disabled>Selecione um veículo</option>
              <option v-for="vehicle in availableVehicles" :key="vehicle.id" :value="vehicle.id">
                {{ vehicle.plate }} - {{ vehicle.brand }} {{ vehicle.model }}
              </option>
            </select>
            <div v-if="availableVehicles.length === 0" class="form-warning">
              Não há veículos disponíveis. <router-link to="/fleet">Adicionar veículo</router-link>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="startingPoint">Ponto de Partida</label>
          <input type="text" id="startingPoint" v-model="startingPoint" required>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="totalDistance">Distância Total (km)</label>
            <input type="number" id="totalDistance" v-model="totalDistance" @change="updateFuelCost" min="0" step="0.1" required>
          </div>
          
          <div class="form-group">
            <label for="estimatedFuelCost">Custo Estimado de Combustível</label>
            <input type="number" id="estimatedFuelCost" v-model="estimatedFuelCost" min="0" step="0.01" readonly>
            <small>Calculado automaticamente com base na distância e eficiência do veículo</small>
          </div>
        </div>
      </div>
      
      <div class="form-section">
        <h3>Destinos</h3>
        
        <div class="add-destination-form">
          <div class="form-group">
            <label for="destinationAddress">Endereço</label>
            <input type="text" id="destinationAddress" v-model="destinationAddress">
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="scheduledArrival">Horário Previsto</label>
              <input type="datetime-local" id="scheduledArrival" v-model="scheduledArrival">
            </div>
            
            <div class="form-group">
              <label for="destinationOrder">Ordem</label>
              <input type="number" id="destinationOrder" v-model="destinationOrder" min="1">
            </div>
          </div>
          
          <div class="form-group">
            <label for="destinationNotes">Observações</label>
            <textarea id="destinationNotes" v-model="destinationNotes"></textarea>
          </div>
          
          <div class="form-actions">
            <button @click="addDestination" class="btn-add" type="button">Adicionar Destino</button>
          </div>
        </div>
        
        <div class="destinations-list" v-if="destinations.length > 0">
          <table>
            <thead>
              <tr>
                <th>Ordem</th>
                <th>Endereço</th>
                <th>Horário Previsto</th>
                <th>Observações</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(destination, index) in destinations" :key="index">
                <td>{{ destination.order }}</td>
                <td>{{ destination.address }}</td>
                <td>{{ destination.scheduledArrival }}</td>
                <td>{{ destination.notes || '-' }}</td>
                <td>
                  <button @click="removeDestination(index)" class="btn-remove">Remover</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="no-items" v-else>
          <p>Nenhum destino adicionado à rota.</p>
        </div>
      </div>
      
      <div class="form-actions">
        <router-link to="/fleet/routes" class="btn-secondary">Cancelar</router-link>
        <button @click="saveRoute" class="btn-primary" :disabled="destinations.length === 0 || !selectedDriverId || !selectedVehicleId">
          Salvar Rota
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.create-route {
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 1.5rem;
}

h1 {
  margin: 0;
}

.route-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.form-section h3 {
  margin-top: 0;
  margin-bottom: 1.2rem;
  font-size: 1.2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

.form-warning {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 0.5rem;
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

small {
  display: block;
  color: #666;
  font-size: 0.8rem;
  margin-top: 0.3rem;
}

.add-destination-form {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.destinations-list {
  margin-bottom: 1rem;
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

.no-items {
  background-color: #f9f9f9;
  padding: 1.5rem;
  text-align: center;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-primary {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
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

.btn-add {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}

.btn-add:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.btn-remove {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}
</style>