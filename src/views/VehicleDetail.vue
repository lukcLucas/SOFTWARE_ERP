<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useVehicleStore } from '../stores/vehicles';
import { format } from 'date-fns';
import type { MaintenanceRecord, FuelRecord, VehicleDocument } from '../types';

const route = useRoute();
const router = useRouter();
const vehicleStore = useVehicleStore();

const vehicleId = computed(() => route.params.id as string);
const vehicle = computed(() => {
  return vehicleStore.vehicles.find(v => v.id === vehicleId.value);
});

// Maintenance form
const showMaintenanceForm = ref(false);
const newMaintenance = ref<Omit<MaintenanceRecord, 'id'>>({
  date: format(new Date(), 'yyyy-MM-dd'),
  description: '',
  cost: 0,
  odometer: vehicle.value?.odometer || 0,
  type: 'preventive',
  provider: '',
  notes: ''
});

const addMaintenance = () => {
  if (!vehicle.value) return;
  
  vehicleStore.addMaintenanceRecord(vehicle.value.id, newMaintenance.value);
  showMaintenanceForm.value = false;
  resetMaintenanceForm();
};

const resetMaintenanceForm = () => {
  newMaintenance.value = {
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    cost: 0,
    odometer: vehicle.value?.odometer || 0,
    type: 'preventive',
    provider: '',
    notes: ''
  };
};

// Fuel form
const showFuelForm = ref(false);
const newFuel = ref<Omit<FuelRecord, 'id'>>({
  date: format(new Date(), 'yyyy-MM-dd'),
  quantity: 0,
  liters: 0,
  cost: 0,
  odometer: vehicle.value?.odometer || 0,
  fuelType: vehicle.value?.fuelType || 'gasoline',
  fullTank: true,
  station: ''
});

const addFuel = () => {
  if (!vehicle.value) return;
  
  vehicleStore.addFuelRecord(vehicle.value.id, newFuel.value);
  showFuelForm.value = false;
  resetFuelForm();
};

const resetFuelForm = () => {
  newFuel.value = {
    date: format(new Date(), 'yyyy-MM-dd'),
    quantity: 0,
    liters: 0,
    cost: 0,
    odometer: vehicle.value?.odometer || 0,
    fuelType: vehicle.value?.fuelType || 'gasoline',
    fullTank: true,
    station: ''
  };
};

// Document form
const showDocumentForm = ref(false);
const newDocument = ref<Omit<VehicleDocument, 'id'>>({
  name: '',
  type: '',
  number: '',
  expirationDate: format(new Date(), 'yyyy-MM-dd'),
  status: 'valid'
});

const addDocument = () => {
  if (!vehicle.value) return;
  
  vehicleStore.addVehicleDocument(vehicle.value.id, newDocument.value);
  showDocumentForm.value = false;
  resetDocumentForm();
};

const resetDocumentForm = () => {
  newDocument.value = {
    name: '',
    type: '',
    number: '',
    expirationDate: format(new Date(), 'yyyy-MM-dd'),
    status: 'valid'
  };
};

// Status update
const updateStatus = (newStatus: 'available' | 'in_use' | 'maintenance' | 'inactive') => {
  if (vehicle.value) {
    vehicleStore.updateVehicle(vehicle.value.id, { status: newStatus });
  }
};

// Helpers
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
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

const getVehicleStatusLabel = (status: string) => {
  switch (status) {
    case 'available': return 'Disponível';
    case 'in_use': return 'Em Uso';
    case 'maintenance': return 'Em Manutenção';
    case 'inactive': return 'Inativo';
    default: return status;
  }
};

const getVehicleStatusClass = (status: string) => {
  switch (status) {
    case 'available': return 'status-available';
    case 'in_use': return 'status-in-use';
    case 'maintenance': return 'status-maintenance';
    case 'inactive': return 'status-inactive';
    default: return '';
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

const getMaintenanceTypeLabel = (type: string) => {
  switch (type) {
    case 'preventive': return 'Preventiva';
    case 'corrective': return 'Corretiva';
    case 'inspection': return 'Inspeção';
    default: return type;
  }
};

const getDocumentStatusLabel = (status: string) => {
  switch (status) {
    case 'valid': return 'Válido';
    case 'expired': return 'Expirado';
    case 'pending': return 'Pendente';
    default: return status;
  }
};

const getDocumentStatusClass = (status: string) => {
  switch (status) {
    case 'valid': return 'status-valid';
    case 'expired': return 'status-expired';
    case 'pending': return 'status-pending';
    default: return '';
  }
};

const deleteVehicle = () => {
  if (confirm('Tem certeza que deseja excluir este veículo?')) {
    if (vehicle.value) {
      vehicleStore.deleteVehicle(vehicle.value.id);
      router.push('/fleet');
    }
  }
};
</script>

<template>
  <div class="vehicle-detail" v-if="vehicle">
    <div class="page-header">
      <div>
        <h1>{{ vehicle.brand }} {{ vehicle.model }} - {{ vehicle.plate }}</h1>
        <span :class="['status-badge', getVehicleStatusClass(vehicle.status)]">
          {{ getVehicleStatusLabel(vehicle.status) }}
        </span>
      </div>
      <div class="header-actions">
        <button @click="deleteVehicle" class="btn-delete">Excluir</button>
        <div class="status-actions">
          <button 
            v-if="vehicle.status !== 'available'" 
            @click="updateStatus('available')" 
            class="btn-success"
          >
            Marcar como Disponível
          </button>
          <button 
            v-if="vehicle.status !== 'maintenance'" 
            @click="updateStatus('maintenance')" 
            class="btn-warning"
          >
            Enviar para Manutenção
          </button>
          <button 
            v-if="vehicle.status !== 'inactive'" 
            @click="updateStatus('inactive')" 
            class="btn-secondary"
          >
            Desativar
          </button>
        </div>
      </div>
    </div>
    
    <div class="vehicle-overview">
      <div class="overview-card">
        <h3>Informações Gerais</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Marca:</span>
            <span class="info-value">{{ vehicle.brand }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Modelo:</span>
            <span class="info-value">{{ vehicle.model }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Ano:</span>
            <span class="info-value">{{ vehicle.year }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Tipo:</span>
            <span class="info-value">{{ getVehicleTypeLabel(vehicle.type) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Placa:</span>
            <span class="info-value">{{ vehicle.plate }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Combustível:</span>
            <span class="info-value">{{ getFuelTypeLabel(vehicle.fuelType) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Consumo:</span>
            <span class="info-value">{{ vehicle.fuelEfficiency }} km/L</span>
          </div>
          <div class="info-item">
            <span class="info-label">Km Atual:</span>
            <span class="info-value">{{ vehicle.odometer }} km</span>
          </div>
        </div>
      </div>
      
      <div class="overview-card">
        <h3>Manutenção</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Última Manutenção:</span>
            <span class="info-value">{{ vehicle.lastMaintenance }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Próxima Manutenção:</span>
            <span class="info-value">{{ vehicle.nextMaintenance }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Documents Section -->
    <div class="vehicle-section">
      <div class="section-header">
        <h3>Documentos</h3>
        <button @click="showDocumentForm = true" class="btn-add">Adicionar Documento</button>
      </div>
      
      <div v-if="showDocumentForm" class="form-container">
        <h4>Adicionar Documento</h4>
        <form @submit.prevent="addDocument">
          <div class="form-row">
            <div class="form-group">
              <label for="docName">Nome do Documento</label>
              <input type="text" id="docName" v-model="newDocument.name" required>
            </div>
            <div class="form-group">
              <label for="docType">Tipo</label>
              <input type="text" id="docType" v-model="newDocument.type" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="docNumber">Número</label>
              <input type="text" id="docNumber" v-model="newDocument.number" required>
            </div>
            <div class="form-group">
              <label for="docExpiration">Data de Vencimento</label>
              <input type="date" id="docExpiration" v-model="newDocument.expirationDate" required>
            </div>
          </div>
          <div class="form-group">
            <label for="docStatus">Status</label>
            <select id="docStatus" v-model="newDocument.status" required>
              <option value="valid">Válido</option>
              <option value="expired">Expirado</option>
              <option value="pending">Pendente</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" @click="showDocumentForm = false" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary">Salvar</button>
          </div>
        </form>
      </div>
      
      <table v-if="vehicle.documents && vehicle.documents.length > 0">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Número</th>
            <th>Vencimento</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doc in vehicle.documents" :key="doc.id">
            <td>{{ doc.name || doc.type }}</td>
            <td>{{ doc.type }}</td>
            <td>{{ doc.number }}</td>
            <td>{{ doc.expirationDate }}</td>
            <td>
              <span :class="['status-badge', getDocumentStatusClass(doc.status)]">
                {{ getDocumentStatusLabel(doc.status) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">
        <p>Nenhum documento cadastrado para este veículo.</p>
      </div>
    </div>
    
    <!-- Maintenance History Section -->
    <div class="vehicle-section">
      <div class="section-header">
        <h3>Histórico de Manutenção</h3>
        <button @click="showMaintenanceForm = true" class="btn-add">Registrar Manutenção</button>
      </div>
      
      <div v-if="showMaintenanceForm" class="form-container">
        <h4>Registrar Manutenção</h4>
        <form @submit.prevent="addMaintenance">
          <div class="form-row">
            <div class="form-group">
              <label for="maintDate">Data</label>
              <input type="date" id="maintDate" v-model="newMaintenance.date" required>
            </div>
            <div class="form-group">
              <label for="maintType">Tipo</label>
              <select id="maintType" v-model="newMaintenance.type" required>
                <option value="preventive">Preventiva</option>
                <option value="corrective">Corretiva</option>
                <option value="inspection">Inspeção</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="maintKm">Quilometragem</label>
              <input type="number" id="maintKm" v-model="newMaintenance.odometer" required>
            </div>
            <div class="form-group">
              <label for="maintCost">Custo</label>
              <input type="number" id="maintCost" v-model="newMaintenance.cost" step="0.01" required>
            </div>
          </div>
          <div class="form-group">
            <label for="maintDescription">Descrição</label>
            <textarea id="maintDescription" v-model="newMaintenance.description" required></textarea>
          </div>
          <div class="form-group">
            <label for="maintProvider">Fornecedor</label>
            <input type="text" id="maintProvider" v-model="newMaintenance.provider" required>
          </div>
          <div class="form-group">
            <label for="maintNotes">Observações</label>
            <textarea id="maintNotes" v-model="newMaintenance.notes"></textarea>
          </div>
          <div class="form-actions">
            <button type="button" @click="showMaintenanceForm = false" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary">Salvar</button>
          </div>
        </form>
      </div>
      
      <table v-if="vehicle.maintenanceHistory && vehicle.maintenanceHistory.length > 0">
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipo</th>
            <th>Descrição</th>
            <th>Quilometragem</th>
            <th>Fornecedor</th>
            <th>Custo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in vehicle.maintenanceHistory" :key="record.id">
            <td>{{ record.date }}</td>
            <td>{{ getMaintenanceTypeLabel(record.type) }}</td>
            <td>{{ record.description }}</td>
            <td>{{ record.odometer }} km</td>
            <td>{{ record.provider }}</td>
            <td>{{ formatCurrency(record.cost) }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">
        <p>Nenhum registro de manutenção para este veículo.</p>
      </div>
    </div>
    
    <!-- Fuel History Section -->
    <div class="vehicle-section">
      <div class="section-header">
        <h3>Histórico de Abastecimento</h3>
        <button @click="showFuelForm = true" class="btn-add">Registrar Abastecimento</button>
      </div>
      
      <div v-if="showFuelForm" class="form-container">
        <h4>Registrar Abastecimento</h4>
        <form @submit.prevent="addFuel">
          <div class="form-row">
            <div class="form-group">
              <label for="fuelDate">Data</label>
              <input type="date" id="fuelDate" v-model="newFuel.date" required>
            </div>
            <div class="form-group">
              <label for="fuelKm">Quilometragem</label>
              <input type="number" id="fuelKm" v-model="newFuel.odometer" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="fuelLiters">Litros</label>
              <input type="number" id="fuelLiters" v-model="newFuel.liters" step="0.01" required>
            </div>
            <div class="form-group">
              <label for="fuelCost">Custo Total</label>
              <input type="number" id="fuelCost" v-model="newFuel.cost" step="0.01" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="fuelType">Tipo de Combustível</label>
              <select id="fuelType" v-model="newFuel.fuelType" required>
                <option value="gasoline">Gasolina</option>
                <option value="diesel">Diesel</option>
                <option value="ethanol">Etanol</option>
                <option value="electric">Elétrico</option>
                <option value="hybrid">Híbrido</option>
              </select>
            </div>
            <div class="form-group">
              <label for="fuelStation">Posto</label>
              <input type="text" id="fuelStation" v-model="newFuel.station">
            </div>
          </div>
          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" v-model="newFuel.fullTank">
              Tanque Completo
            </label>
          </div>
          <div class="form-actions">
            <button type="button" @click="showFuelForm = false" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary">Salvar</button>
          </div>
        </form>
      </div>
      
      <table v-if="vehicle.fuelHistory && vehicle.fuelHistory.length > 0">
        <thead>
          <tr>
            <th>Data</th>
            <th>Quilometragem</th>
            <th>Litros</th>
            <th>Combustível</th>
            <th>Posto</th>
            <th>Custo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in vehicle.fuelHistory" :key="record.id">
            <td>{{ record.date }}</td>
            <td>{{ record.odometer }} km</td>
            <td>{{ record.quantity || record.liters }} L</td>
            <td>{{ getFuelTypeLabel(record.fuelType) }}</td>
            <td>{{ record.station || '-' }}</td>
            <td>{{ formatCurrency(record.cost) }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">
        <p>Nenhum registro de abastecimento para este veículo.</p>
      </div>
    </div>
  </div>
  <div v-else class="not-found">
    <h2>Veículo não encontrado</h2>
    <router-link to="/fleet" class="btn-primary">Voltar para Frota</router-link>
  </div>
</template>

<style scoped>
.vehicle-detail {
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

.status-valid {
  background-color: #c8e6c9;
  color: #388e3c;
}

.status-expired {
  background-color: #ffcdd2;
  color: #d32f2f;
}

.status-pending {
  background-color: #fff9c4;
  color: #fbc02d;
}

.vehicle-overview {
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

.vehicle-section {
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

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-group input {
  width: auto;
  margin-right: 0.5rem;
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
  margin-top: 1.5rem;
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
</style>