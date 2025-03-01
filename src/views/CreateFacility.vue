<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFacilityStore } from '../stores/facilities';
import type { Facility } from '../types';

const router = useRouter();
const facilityStore = useFacilityStore();

const facility = ref<Omit<Facility, 'id' | 'maintenanceRecords' | 'rooms' | 'utilities'>>({
  name: '',
  address: '',
  type: 'office',
  size: 0,
  floors: 1,
  status: 'active'
});

const saveFacility = () => {
  facilityStore.addFacility(facility.value);
  router.push('/facilities');
};
</script>

<template>
  <div class="create-facility">
    <div class="page-header">
      <h1>Nova Instalação</h1>
    </div>
    
    <div class="facility-form">
      <form @submit.prevent="saveFacility">
        <div class="form-section">
          <h3>Informações Básicas</h3>
          
          <div class="form-group">
            <label for="name">Nome</label>
            <input type="text" id="name" v-model="facility.name" required>
          </div>
          
          <div class="form-group">
            <label for="address">Endereço</label>
            <input type="text" id="address" v-model="facility.address" required>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="type">Tipo</label>
              <select id="type" v-model="facility.type" required>
                <option value="office">Escritório</option>
                <option value="warehouse">Depósito</option>
                <option value="retail">Loja</option>
                <option value="other">Outro</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" v-model="facility.status" required>
                <option value="active">Ativa</option>
                <option value="inactive">Inativa</option>
                <option value="under_maintenance">Em Manutenção</option>
                <option value="under_construction">Em Construção</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="size">Tamanho (m²)</label>
              <input type="number" id="size" v-model="facility.size" min="0" required>
            </div>
            
            <div class="form-group">
              <label for="floors">Número de Andares</label>
              <input type="number" id="floors" v-model="facility.floors" min="1" required>
            </div>
          </div>
        </div>
        
        <div class="form-actions">
          <router-link to="/facilities" class="btn-secondary">Cancelar</router-link>
          <button type="submit" class="btn-primary">Salvar Instalação</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.create-facility {
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 1.5rem;
}

h1 {
  margin: 0;
}

.facility-form {
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