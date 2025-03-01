<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDriverStore } from '../stores/drivers';
import { format, addYears } from 'date-fns';
import type { Driver } from '../types';

const router = useRouter();
const driverStore = useDriverStore();

const driver = ref<Omit<Driver, 'id'>>({
  name: '',
  licenseNumber: '',
  licenseType: '',
  licenseExpiration: format(addYears(new Date(), 5), 'yyyy-MM-dd'),
  phone: '',
  email: '',
  status: 'available'
});

const saveDriver = () => {
  driverStore.addDriver(driver.value);
  router.push('/fleet/drivers');
};
</script>

<template>
  <div class="create-driver">
    <div class="page-header">
      <h1>Novo Motorista</h1>
    </div>
    
    <div class="driver-form">
      <form @submit.prevent="saveDriver">
        <div class="form-section">
          <h3>Informações Pessoais</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="name">Nome</label>
              <input type="text" id="name" v-model="driver.name" required>
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" v-model="driver.email" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="phone">Telefone</label>
              <input type="text" id="phone" v-model="driver.phone" required>
            </div>
            
            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" v-model="driver.status" required>
                <option value="available">Disponível</option>
                <option value="off_duty">Fora de Serviço</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="form-section">
          <h3>Informações da CNH</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="licenseNumber">Número da CNH</label>
              <input type="text" id="licenseNumber" v-model="driver.licenseNumber" required>
            </div>
            
            <div class="form-group">
              <label for="licenseType">Categoria da CNH</label>
              <select id="licenseType" v-model="driver.licenseType" required>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="AB">AB</option>
                <option value="AC">AC</option>
                <option value="AD">AD</option>
                <option value="AE">AE</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label for="licenseExpiration">Validade da CNH</label>
            <input type="date" id="licenseExpiration" v-model="driver.licenseExpiration" required>
          </div>
        </div>
        
        <div class="form-actions">
          <router-link to="/fleet/drivers" class="btn-secondary">Cancelar</router-link>
          <button type="submit" class="btn-primary">Salvar Motorista</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.create-driver {
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 1.5rem;
}

h1 {
  margin: 0;
}

.driver-form {
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