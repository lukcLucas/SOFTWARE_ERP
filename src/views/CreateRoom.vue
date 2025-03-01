<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFacilityStore } from '../stores/facilities';
import type { Room } from '../types';

const route = useRoute();
const router = useRouter();
const facilityStore = useFacilityStore();

const facilityId = computed(() => route.params.facilityId as string);
const facility = computed(() => {
  return facilityStore.facilities.find(f => f.id === facilityId.value);
});

const room = ref<Omit<Room, 'id' | 'facilityId' | 'equipment' | 'reservations'>>({
  name: '',
  type: 'meeting',
  capacity: 0,
  floor: 1,
  status: 'available'
});

const saveRoom = () => {
  if (!facility.value) return;
  
  facilityStore.addRoom(facility.value.id, room.value);
  router.push(`/facilities/${facilityId.value}/rooms`);
};
</script>

<template>
  <div class="create-room" v-if="facility">
    <div class="page-header">
      <h1>Nova Sala - {{ facility.name }}</h1>
    </div>
    
    <div class="room-form">
      <form @submit.prevent="saveRoom">
        <div class="form-section">
          <h3>Informações Básicas</h3>
          
          <div class="form-group">
            <label for="name">Nome</label>
            <input type="text" id="name" v-model="room.name" required>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="type">Tipo</label>
              <select id="type" v-model="room.type" required>
                <option value="meeting">Sala de Reunião</option>
                <option value="office">Escritório</option>
                <option value="storage">Armazenamento</option>
                <option value="common">Área Comum</option>
                <option value="other">Outro</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" v-model="room.status" required>
                <option value="available">Disponível</option>
                <option value="occupied">Ocupada</option>
                <option value="maintenance">Em Manutenção</option>
                <option value="reserved">Reservada</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="capacity">Capacidade (pessoas)</label>
              <input type="number" id="capacity" v-model="room.capacity" min="0">
            </div>
            
            <div class="form-group">
              <label for="floor">Andar</label>
              <input type="number" id="floor" v-model="room.floor" min="1" required>
            </div>
          </div>
        </div>
        
        <div class="form-actions">
          <router-link :to="`/facilities/${facilityId}/rooms`" class="btn-secondary">Cancelar</router-link>
          <button type="submit" class="btn-primary">Salvar Sala</button>
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
.create-room {
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 1.5rem;
}

h1 {
  margin: 0;
}

.room-form {
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