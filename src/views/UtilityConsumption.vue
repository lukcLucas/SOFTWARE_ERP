<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useFacilityStore } from '../stores/facilities';
import type { UtilityConsumption } from '../types';

const route = useRoute();
const facilityStore = useFacilityStore();

const facilityId = computed(() => route.params.facilityId as string);
const facility = computed(() => {
  return facilityStore.facilities.find(f => f.id === facilityId.value);
});

const utilities = computed(() => {
  if (!facility.value) return [];
  return facility.value.utilities;
});

// New utility consumption form
const showUtilityForm = ref(false);
const newUtility = ref<Omit<UtilityConsumption, 'id' | 'facilityId'>>({
  type: 'electricity',
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  reading: 0,
  unit: 'kWh',
  cost: 0,
  notes: ''
});

const addUtility = () => {
  if (!facility.value) return;
  
  facilityStore.addUtilityConsumption(facility.value.id, newUtility.value);
  showUtilityForm.value = false;
  resetUtilityForm();
};

const resetUtilityForm = () => {
  newUtility.value = {
    type: 'electricity',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    reading: 0,
    unit: 'kWh',
    cost: 0,
    notes: ''
  };
};

// Helpers
const getUtilityTypeLabel = (type: string) => {
  switch (type) {
    case 'electricity': return 'Eletricidade';
    case 'water': return 'Água';
    case 'gas': return 'Gás';
    case 'internet': return 'Internet';
    case 'other': return 'Outro';
    default: return type;
  }
};

const getMonthName = (month: number) => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return months[month - 1];
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const getDefaultUnit = (type: string) => {
  switch (type) {
    case 'electricity': return 'kWh';
    case 'water': return 'm³';
    case 'gas': return 'm³';
    case 'internet': return 'GB';
    default: return '';
  }
};

// Update unit when type changes
const updateUnit = () => {
  newUtility.value.unit = getDefaultUnit(newUtility.value.type);
};
</script>

<template>
  <div class="utility-page" v-if="facility">
    <div class="page-header">
      <div>
        <h1>Consumo de Recursos - {{ facility.name }}</h1>
        <p class="facility-address">{{ facility.address }}</p>
      </div>
      <div class="header-actions">
        <button @click="showUtilityForm = true" class="btn-primary">Registrar Consumo</button>
        <router-link :to="`/facilities/${facilityId}`" class="btn-secondary">Voltar para Instalação</router-link>
      </div>
    </div>
    
    <div v-if="showUtilityForm" class="form-container">
      <h3>Registrar Consumo</h3>
      <form @submit.prevent="addUtility">
        <div class="form-row">
          <div class="form-group">
            <label for="utilityType">Tipo</label>
            <select id="utilityType" v-model="newUtility.type" @change="updateUnit" required>
              <option value="electricity">Eletricidade</option>
              <option value="water">Água</option>
              <option value="gas">Gás</option>
              <option value="internet">Internet</option>
              <option value="other">Outro</option>
            </select>
          </div>
          <div class="form-group">
            <label for="utilityUnit">Unidade</label>
            <input type="text" id="utilityUnit" v-model="newUtility.unit" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="utilityYear">Ano</label>
            <input type="number" id="utilityYear" v-model="newUtility.year" required>
          </div>
          <div class="form-group">
            <label for="utilityMonth">Mês</label>
            <select id="utilityMonth" v-model="newUtility.month" required>
              <option value="1">Janeiro</option>
              <option value="2">Fevereiro</option>
              <option value="3">Março</option>
              <option value="4">Abril</option>
              <option value="5">Maio</option>
              <option value="6">Junho</option>
              <option value="7">Julho</option>
              <option value="8">Agosto</option>
              <option value="9">Setembro</option>
              <option value="10">Outubro</option>
              <option value="11">Novembro</option>
              <option value="12">Dezembro</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="utilityReading">Leitura</label>
            <input type="number" id="utilityReading" v-model="newUtility.reading" min="0" step="0.01" required>
          </div>
          <div class="form-group">
            <label for="utilityCost">Custo</label>
            <input type="number" id="utilityCost" v-model="newUtility.cost" min="0" step="0.01" required>
          </div>
        </div>
        <div class="form-group">
          <label for="utilityNotes">Observações</label>
          <textarea id="utilityNotes" v-model="newUtility.notes"></textarea>
        </div>
        <div class="form-actions">
          <button type="button" @click="showUtilityForm = false" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">Salvar</button>
        </div>
      </form>
    </div>
    
    <div class="utility-container">
      <table v-if="utilities.length > 0">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Período</th>
            <th>Leitura</th>
            <th>Custo</th>
            <th>Observações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="utility in utilities" :key="utility.id">
            <td>{{ getUtilityTypeLabel(utility.type) }}</td>
            <td>{{ getMonthName(utility.month) }}/{{ utility.year }}</td>
            <td>{{ utility.reading }} {{ utility.unit }}</td>
            <td>{{ formatCurrency(utility.cost) }}</td>
            <td>{{ utility.notes || '-' }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">
        <p>Nenhum registro de consumo para esta instalação.</p>
        <button @click="showUtilityForm = true" class="btn-primary">Registrar Consumo</button>
      </div>
    </div>
  </div>
  <div v-else class="not-found">
    <h2>Instalação não encontrada</h2>
    <router-link to="/facilities" class="btn-primary">Voltar para Instalações</router-link>
  </div>
</template>

<style scoped>
.utility-page {
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

.form-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-container h3 {
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
  margin-top: 1.5rem;
}

.utility-container {
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