<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useVehicleStore } from '../stores/vehicles';
import { format, addMonths } from 'date-fns';
import type { Vehicle } from '../types';

const router = useRouter();
const vehicleStore = useVehicleStore();

const vehicle = ref<Omit<Vehicle, 'id' | 'documents' | 'maintenanceHistory' | 'fuelHistory'>>({
  plate: '',
  model: '',
  brand: '',
  year: new Date().getFullYear(),
  type: 'car',
  status: 'available',
  lastMaintenance: format(new Date(), 'yyyy-MM-dd'),
  nextMaintenance: format(addMonths(new Date(), 3), 'yyyy-MM-dd'),
  odometer: 0,
  fuelType: 'gasoline',
  fuelEfficiency: 0
});

const saveVehicle = () => {
  vehicleStore.addVehicle(vehicle.value);
  router.push('/fleet');
};
</script>

<template>
  <div class="create-vehicle">
    <div class="page-header">
      <h1>Novo Veículo</h1>
    </div>
    
    <div class="vehicle-form">
      <form @submit.prevent="saveVehicle">
        <div class="form-section">
          <h3>Informações Básicas</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="plate">Placa</label>
              <input type="text" id="plate" v-model="vehicle.plate" required>
            </div>
            
            <div class="form-group">
              <label for="model">Modelo</label>
              <input type="text" id="model" v-model="vehicle.model" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="brand">Marca</label>
              <input type="text" id="brand" v-model="vehicle.brand" required>
            </div>
            
            <div class="form-group">
              <label for="year">Ano</label>
              <input type="number" id="year" v-model="vehicle.year" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="type">Tipo</label>
              <select id="type" v-model="vehicle.type" required>
                <option value="car">Carro</option>
                <option value="truck">Caminhão</option>
                <option value="van">Van</option>
                <option value="motorcycle">Moto</option>
                <option value="other">Outro</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" v-model="vehicle.status" required>
                <option value="available">Disponível</option>
                <option value="in_use">Em Uso</option>
                <option value="maintenance">Em Manutenção</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="form-section">
          <h3>Informações Técnicas</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="odometer">Quilometragem Atual</label>
              <input type="number" id="odometer" v-model="vehicle.odometer" required>
            </div>
            
            <div class="form-group">
              <label for="fuelEfficiency">Consumo (km/L)</label>
              <input type="number" id="fuelEfficiency" v-model="vehicle.fuelEfficiency" step="0.1" required>
            </div>
          </div>
          
          <div class="form-group">
            <label for="fuelType">Tipo de Combustível</label>
            <select id="fuelType" v-model="vehicle.fuelType" required>
              <option value="gasoline">Gasolina</option>
              <option value="diesel">Diesel</option>
              <option value="ethanol">Etanol</option>
              <option value="electric">Elétrico</option>
              <option value="hybrid">Híbrido</option>
            </select>
          </div>
        </div>
        
        <div class="form-section">
          <h3>Manutenção</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="lastMaintenance">Última Manutenção</label>
              <input type="date" id="lastMaintenance" v-model="vehicle.lastMaintenance" required>
            </div>
            
            <div class="form-group">
              <label for="nextMaintenance">Próxima Manutenção</label>
              <input type="date" id="nextMaintenance" v-model="vehicle.nextMaintenance" required>
            </div>
          </div>
        </div>
        
        <div class="form-actions">
          <router-link to="/fleet" class="btn-secondary">Cancelar</router-link>
          <button type="submit" class="btn-primary">Salvar Veículo</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.create-vehicle {
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 1.5rem;
}

h1 {
  margin: 0;
}

.vehicle-form {
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

.btn-primary {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
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