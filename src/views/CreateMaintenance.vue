<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFacilityStore } from '../stores/facilities';
import { format } from 'date-fns';
import type { FacilityMaintenanceRecord } from '../types';

const route = useRoute();
const router = useRouter();
const facilityStore = useFacilityStore();

const facilityId = computed(() => route.params.facilityId as string);
const facility = computed(() => {
  return facilityStore.facilities.find(f => f.id === facilityId.value);
});

const maintenance = ref<Omit<FacilityMaintenanceRecord, 'id' | 'facilityId'>>({
  date: format(new Date(), 'yyyy-MM-dd'),
  type: 'preventive',
  description: '',
  area: '',
  cost: 0,
  provider: '',
  status: 'scheduled',
  completionDate: '',
  notes: ''
});

const saveMaintenance = () => {
  if (!facility.value) return;
  
  facilityStore.addMaintenanceRecord(facility.value.id, maintenance.value);
  router.push(`/facilities/${facilityId.value}/maintenance`);
};
</script>

<template>
  <div class="create-maintenance" v-if="facility">
    <div class="page-header">
      <h1>Nova Manutenção - {{ facility.name }}</h1>
    </div>
    
    <div class="maintenance-form">
      <form @submit.prevent="saveMaintenance">
        <div class="form-section">
          <h3>Informações da Manutenção</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="date">Data</label>
              <input type="date" id="date" v-model="maintenance.date" required>
            </div>
            
            <div class="form-group">
              <label for="type">Tipo</label>
              <select id="type" v-model="maintenance.type" required>
                <option value="preventive">Preventiva</option>
                <option value="corrective">Corretiva</option>
                <option value="inspection">Inspeção</option>
                <option value="emergency">Emergência</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label for="description">Descrição</label>
            <textarea id="description" v-model="maintenance.description" required></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="area">Área</label>
              <input type="text" id="area" v-model="maintenance.area" required>
            </div>
            
            <div class="form-group">
              <label for="provider">Fornecedor</label>
              <input type="text" id="provider" v-model="maintenance.provider" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="cost">Custo</label>
              <input type="number" id="cost" v-model="maintenance.cost" min="0" step="0.01" required>
            </div>
            
            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" v-model="maintenance.status" required>
                <option value="scheduled">Agendada</option>
                <option value="in_progress">Em Andamento</option>
                <option value="completed">Concluída</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>
          </div>
          
          <div class="form-group" v-if="maintenance.status === 'completed'">
            <label for="completionDate">Data de Conclusão</label>
            <input type="date" id="completionDate" v-model="maintenance.completionDate">
          </div>
          
          <div class="form-group">
            <label for="notes">Observações</label>
            <textarea id="notes" v-model="maintenance.notes"></textarea>
          </div>
        </div>
        
        <div class="form-actions">
          <router-link :to="`/facilities/${facilityId}/maintenance`" class="btn-secondary">Cancelar</router-link>
          <button type="submit" class="btn-primary">Salvar Manutenção</button>
        </div>
      </form>
    </div>
  </div>
  <div v-else class="not-found">
    <h2>Instalação não encontrada</h2>
    <router-link to="/facilities" class="btn-primary">Voltar para Instalações</router-link>
  </div>
</template>

<style scoped>
.create-maintenance {
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 1.5rem;
}

h1 {
  margin: 0;
}

.maintenance-form {
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

.not-found {
  padding: 2rem;
  text-align: center;
}
</style>