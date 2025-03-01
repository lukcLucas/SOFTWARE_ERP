<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDriverStore } from '../stores/drivers';
import type { Driver } from '../types';
import { format } from 'date-fns';

const driverStore = useDriverStore();
const drivers = computed(() => driverStore.drivers);

const showForm = ref(false);
const editingDriverId = ref<string | null>(null);

const newDriver = ref<Omit<Driver, 'id'>>({
  name: '',
  licenseNumber: '',
  licenseType: '',
  licenseExpiration: format(new Date(), 'yyyy-MM-dd'),
  phone: '',
  email: '',
  status: 'available'
});

const resetForm = () => {
  newDriver.value = {
    name: '',
    licenseNumber: '',
    licenseType: '',
    licenseExpiration: format(new Date(), 'yyyy-MM-dd'),
    phone: '',
    email: '',
    status: 'available'
  };
  editingDriverId.value = null;
};

const openAddForm = () => {
  resetForm();
  showForm.value = true;
};

const openEditForm = (driver: Driver) => {
  newDriver.value = {
    name: driver.name,
    licenseNumber: driver.licenseNumber,
    licenseType: driver.licenseType,
    licenseExpiration: driver.licenseExpiration,
    phone: driver.phone,
    email: driver.email,
    status: driver.status,
    currentVehicleId: driver.currentVehicleId
  };
  editingDriverId.value = driver.id;
  showForm.value = true;
};

const saveDriver = () => {
  if (editingDriverId.value) {
    driverStore.updateDriver(editingDriverId.value, newDriver.value);
  } else {
    driverStore.addDriver(newDriver.value);
  }
  showForm.value = false;
  resetForm();
};

const deleteDriver = (id: string) => {
  if (confirm('Tem certeza que deseja excluir este motorista?')) {
    driverStore.deleteDriver(id);
  }
};

const getDriverStatusLabel = (status: string) => {
  switch (status) {
    case 'available': return 'Disponível';
    case 'on_route': return 'Em Rota';
    case 'off_duty': return 'Fora de Serviço';
    case 'inactive': return 'Inativo';
    default: return status;
  }
};

const getDriverStatusClass = (status: string) => {
  switch (status) {
    case 'available': return 'status-available';
    case 'on_route': return 'status-on-route';
    case 'off_duty': return 'status-off-duty';
    case 'inactive': return 'status-inactive';
    default: return '';
  }
};
</script>

<template>
  <div class="drivers-page">
    <div class="page-header">
      <h1>Motoristas</h1>
      <div class="header-actions">
        <router-link to="/fleet/drivers/create" class="btn-primary">Novo Motorista</router-link>
        <router-link to="/fleet" class="btn-secondary">Veículos</router-link>
        <router-link to="/fleet/routes" class="btn-secondary">Rotas</router-link>
      </div>
    </div>

    <div v-if="showForm" class="form-container">
      <h2>{{ editingDriverId ? 'Editar' : 'Adicionar' }} Motorista</h2>
      <form @submit.prevent="saveDriver">
        <div class="form-row">
          <div class="form-group">
            <label for="name">Nome</label>
            <input type="text" id="name" v-model="newDriver.name" required>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="newDriver.email" required>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="phone">Telefone</label>
            <input type="text" id="phone" v-model="newDriver.phone" required>
          </div>
          
          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" v-model="newDriver.status" required>
              <option value="available">Disponível</option>
              <option value="on_route">Em Rota</option>
              <option value="off_duty">Fora de Serviço</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="licenseNumber">Número da CNH</label>
            <input type="text" id="licenseNumber" v-model="newDriver.licenseNumber" required>
          </div>
          
          <div class="form-group">
            <label for="licenseType">Categoria da CNH</label>
            <input type="text" id="licenseType" v-model="newDriver.licenseType" required>
          </div>
        </div>
        
        <div class="form-group">
          <label for="licenseExpiration">Validade da CNH</label>
          <input type="date" id="licenseExpiration" v-model="newDriver.licenseExpiration" required>
        </div>
        
        <div class="form-actions">
          <button type="button" @click="showForm = false" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">Salvar</button>
        </div>
      </form>
    </div>

    <div class="drivers-list">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Contato</th>
            <th>CNH</th>
            <th>Validade CNH</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="driver in drivers" :key="driver.id">
            <td>{{ driver.name }}</td>
            <td>
              <div>{{ driver.phone }}</div>
              <div>{{ driver.email }}</div>
            </td>
            <td>{{ driver.licenseNumber }} ({{ driver.licenseType }})</td>
            <td>{{ driver.licenseExpiration }}</td>
            <td>
              <span :class="['status-badge', getDriverStatusClass(driver.status)]">
                {{ getDriverStatusLabel(driver.status) }}
              </span>
            </td>
            <td class="actions">
              <router-link :to="`/fleet/drivers/${driver.id}`" class="btn-view">Ver</router-link>
              <button @click="openEditForm(driver)" class="btn-edit">Editar</button>
              <button @click="deleteDriver(driver.id)" class="btn-delete">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.drivers-page {
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

.form-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.drivers-list {
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

.status-available {
  background-color: #c8e6c9;
  color: #388e3c;
}

.status-on-route {
  background-color: #bbdefb;
  color: #1976d2;
}

.status-off-duty {
  background-color: #e0e0e0;
  color: #616161;
}

.status-inactive {
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

.btn-edit {
  background-color: #f39c12;
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