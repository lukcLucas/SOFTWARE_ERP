<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFacilityStore } from '../stores/facilities';
import { format } from 'date-fns';
import type { Equipment, RoomReservation } from '../types';

const route = useRoute();
const router = useRouter();
const facilityStore = useFacilityStore();

const facilityId = computed(() => route.params.facilityId as string);
const roomId = computed(() => route.params.id as string);

const facility = computed(() => {
  return facilityStore.facilities.find(f => f.id === facilityId.value);
});

const room = computed(() => {
  if (!facility.value) return null;
  return facility.value.rooms.find(r => r.id === roomId.value);
});

// Status helpers
const getRoomStatusClass = (status: string) => {
  switch (status) {
    case 'available': return 'status-available';
    case 'occupied': return 'status-occupied';
    case 'maintenance': return 'status-maintenance';
    case 'reserved': return 'status-reserved';
    default: return '';
  }
};

const getRoomStatusLabel = (status: string) => {
  switch (status) {
    case 'available': return 'Disponível';
    case 'occupied': return 'Ocupada';
    case 'maintenance': return 'Em Manutenção';
    case 'reserved': return 'Reservada';
    default: return status;
  }
};

const getRoomTypeLabel = (type: string) => {
  switch (type) {
    case 'meeting': return 'Sala de Reunião';
    case 'office': return 'Escritório';
    case 'storage': return 'Armazenamento';
    case 'common': return 'Área Comum';
    case 'other': return 'Outro';
    default: return type;
  }
};

const getEquipmentStatusClass = (status: string) => {
  switch (status) {
    case 'operational': return 'status-operational';
    case 'maintenance': return 'status-maintenance';
    case 'broken': return 'status-broken';
    case 'retired': return 'status-retired';
    default: return '';
  }
};

const getEquipmentStatusLabel = (status: string) => {
  switch (status) {
    case 'operational': return 'Operacional';
    case 'maintenance': return 'Em Manutenção';
    case 'broken': return 'Quebrado';
    case 'retired': return 'Aposentado';
    default: return status;
  }
};

const getReservationStatusClass = (status: string) => {
  switch (status) {
    case 'scheduled': return 'status-scheduled';
    case 'in_progress': return 'status-in-progress';
    case 'completed': return 'status-completed';
    case 'cancelled': return 'status-cancelled';
    default: return '';
  }
};

const getReservationStatusLabel = (status: string) => {
  switch (status) {
    case 'scheduled': return 'Agendada';
    case 'in_progress': return 'Em Andamento';
    case 'completed': return 'Concluída';
    case 'cancelled': return 'Cancelada';
    default: return status;
  }
};

// Update room status
const updateStatus = (newStatus: 'available' | 'occupied' | 'maintenance' | 'reserved') => {
  if (facility.value && room.value) {
    facilityStore.updateRoom(facility.value.id, room.value.id, { status: newStatus });
  }
};

// Delete room
const deleteRoom = () => {
  if (confirm('Tem certeza que deseja excluir esta sala?')) {
    if (facility.value && room.value) {
      facilityStore.deleteRoom(facility.value.id, room.value.id);
      router.push(`/facilities/${facilityId.value}/rooms`);
    }
  }
};

// Equipment form
const showEquipmentForm = ref(false);
const newEquipment = ref<Omit<Equipment, 'id'>>({
  name: '',
  type: '',
  serialNumber: '',
  purchaseDate: format(new Date(), 'yyyy-MM-dd'),
  warrantyExpiration: '',
  status: 'operational',
  lastMaintenanceDate: '',
  nextMaintenanceDate: ''
});

const addEquipment = () => {
  if (!facility.value || !room.value) return;
  
  facilityStore.addEquipment(facility.value.id, room.value.id, newEquipment.value);
  showEquipmentForm.value = false;
  resetEquipmentForm();
};

const resetEquipmentForm = () => {
  newEquipment.value = {
    name: '',
    type: '',
    serialNumber: '',
    purchaseDate: format(new Date(), 'yyyy-MM-dd'),
    warrantyExpiration: '',
    status: 'operational',
    lastMaintenanceDate: '',
    nextMaintenanceDate: ''
  };
};

// Reservation form
const showReservationForm = ref(false);
const newReservation = ref<Omit<RoomReservation, 'id' | 'roomId'>>({
  userId: '1', // Placeholder user ID
  userName: '',
  purpose: '',
  startTime: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
  endTime: format(new Date(Date.now() + 3600000), 'yyyy-MM-dd\'T\'HH:mm'), // 1 hour later
  status: 'scheduled',
  attendees: 1,
  notes: ''
});

const addReservation = () => {
  if (!facility.value || !room.value) return;
  
  const result = facilityStore.addReservation(facility.value.id, room.value.id, newReservation.value);
  
  if (result && 'error' in result) {
    alert(result.error);
    return;
  }
  
  showReservationForm.value = false;
  resetReservationForm();
};

const resetReservationForm = () => {
  newReservation.value = {
    userId: '1', // Placeholder user ID
    userName: '',
    purpose: '',
    startTime: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
    endTime: format(new Date(Date.now() + 3600000), 'yyyy-MM-dd\'T\'HH:mm'), // 1 hour later
    status: 'scheduled',
    attendees: 1,
    notes: ''
  };
};

// Format date
const formatDateTime = (dateTimeString: string) => {
  const date = new Date(dateTimeString);
  return format(date, 'dd/MM/yyyy HH:mm');
};
</script>

<template>
  <div class="room-detail" v-if="facility && room">
    <div class="page-header">
      <div>
        <h1>{{ room.name }}</h1>
        <p class="facility-name">{{ facility.name }}</p>
        <span :class="['status-badge', getRoomStatusClass(room.status)]">
          {{ getRoomStatusLabel(room.status) }}
        </span>
      </div>
      <div class="header-actions">
        <button @click="deleteRoom" class="btn-delete">Excluir</button>
        <div class="status-actions">
          <button 
            v-if="room.status !== 'available'" 
            @click="updateStatus('available')" 
            class="btn-success"
          >
            Marcar como Disponível
          </button>
          <button 
            v-if="room.status !== 'maintenance'" 
            @click="updateStatus('maintenance')" 
            class="btn-warning"
          >
            Em Manutenção
          </button>
        </div>
      </div>
    </div>
    
    <div class="room-overview">
      <div class="overview-card">
        <h3>Informações Gerais</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Nome:</span>
            <span class="info-value">{{ room.name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Tipo:</span>
            <span class="info-value">{{ getRoomTypeLabel(room.type) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Andar:</span>
            <span class="info-value">{{ room.floor }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Capacidade:</span>
            <span class="info-value">{{ room.capacity > 0 ? room.capacity + ' pessoas' : 'N/A' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Status:</span>
            <span class="info-value">{{ getRoomStatusLabel(room.status) }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Equipment Section -->
    <div class="room-section">
      <div class="section-header">
        <h3>Equipamentos</h3>
        <button @click="showEquipmentForm = true" class="btn-add">Adicionar Equipamento</button>
      </div>
      
      <div v-if="showEquipmentForm" class="form-container">
        <h4>Adicionar Equipamento</h4>
        <form @submit.prevent="addEquipment">
          <div class="form-row">
            <div class="form-group">
              <label for="equipName">Nome</label>
              <input type="text" id="equipName" v-model="newEquipment.name" required>
            </div>
            <div class="form-group">
              <label for="equipType">Tipo</label>
              <input type="text" id="equipType" v-model="newEquipment.type" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="serialNumber">Número de Série</label>
              <input type="text" id="serialNumber" v-model="newEquipment.serialNumber">
            </div>
            <div class="form-group">
              <label for="purchaseDate">Data de Compra</label>
              <input type="date" id="purchaseDate" v-model="newEquipment.purchaseDate" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="warrantyExpiration">Validade da Garantia</label>
              <input type="date" id="warrantyExpiration" v-model="newEquipment.warrantyExpiration">
            </div>
            <div class="form-group">
              <label for="equipStatus">Status</label>
              <select id="equipStatus" v-model="newEquipment.status" required>
                <option value="operational">Operacional</option>
                <option value="maintenance">Em Manutenção</option>
                <option value="broken">Quebrado</option>
                <option value="retired">Aposentado</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="lastMaintenanceDate">Última Manutenção</label>
              <input type="date" id="lastMaintenanceDate" v-model="newEquipment.lastMaintenanceDate">
            </div>
            <div class="form-group">
              <label for="nextMaintenanceDate">Próxima Manutenção</label>
              <input type="date" id="nextMaintenanceDate" v-model="newEquipment.nextMaintenanceDate">
            </div>
          </div>
          <div class="form-actions">
            <button type="button" @click="showEquipmentForm = false" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary">Salvar</button>
          </div>
        </form>
      </div>
      
      <table v-if="room.equipment.length > 0">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Número de Série</th>
            <th>Data de Compra</th>
            <th>Garantia</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="equipment in room.equipment" :key="equipment.id">
            <td>{{ equipment.name }}</td>
            <td>{{ equipment.type }}</td>
            <td>{{ equipment.serialNumber || '-' }}</td>
            <td>{{ equipment.purchaseDate }}</td>
            <td>{{ equipment.warrantyExpiration || '-' }}</td>
            <td>
              <span :class="['status-badge', getEquipmentStatusClass(equipment.status)]">
                {{ getEquipmentStatusLabel(equipment.status) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">
        <p>Nenhum equipamento cadastrado para esta sala.</p>
      </div>
    </div>
    
    <!-- Reservations Section -->
    <div class="room-section">
      <div class="section-header">
        <h3>Reservas</h3>
        <button @click="showReservationForm = true" class="btn-add">Adicionar Reserva</button>
      </div>
      
      <div v-if="showReservationForm" class="form-container">
        <h4>Adicionar Reserva</h4>
        <form @submit.prevent="addReservation">
          <div class="form-row">
            <div class="form-group">
              <label for="userName">Nome do Responsável</label>
              <input type="text" id="userName" v-model="newReservation.userName" required>
            </div>
            <div class="form-group">
              <label for="purpose">Finalidade</label>
              <input type="text" id="purpose" v-model="newReservation.purpose" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="startTime">Início</label>
              <input type="datetime-local" id="startTime" v-model="newReservation.startTime" required>
            </div>
            <div class="form-group">
              <label for="endTime">Término</label>
              <input type="datetime-local" id="endTime" v-model="newReservation.endTime" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="attendees">Número de Participantes</label>
              <input type="number" id="attendees" v-model="newReservation.attendees" min="1" required>
            </div>
            <div class="form-group">
              <label for="reservationStatus">Status</label>
              <select id="reservationStatus" v-model="newReservation.status" required>
                <option value="scheduled">Agendada</option>
                <option value="in_progress">Em Andamento</option>
                <option value="completed">Concluída</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="notes">Observações</label>
            <textarea id="notes" v-model="newReservation.notes"></textarea>
          </div>
          <div class="form-actions">
            <button type="button" @click="showReservationForm = false" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary">Salvar</button>
          </div>
        </form>
      </div>
      
      <table v-if="room.reservations.length > 0">
        <thead>
          <tr>
            <th>Responsável</th>
            <th>Finalidade</th>
            <th>Início</th>
            <th>Término</th>
            <th>Participantes</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reservation in room.reservations" :key="reservation.id">
            <td>{{ reservation.userName }}</td>
            <td>{{ reservation.purpose }}</td>
            <td>{{ formatDateTime(reservation.startTime) }}</td>
            <td>{{ formatDateTime(reservation.endTime) }}</td>
            <td>{{ reservation.attendees }}</td>
            <td>
              <span :class="['status-badge', getReservationStatusClass(reservation.status)]">
                {{ getReservationStatusLabel(reservation.status) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">
        <p>Nenhuma reserva cadastrada para esta sala.</p>
      </div>
    </div>
  </div>
  <div v-else class="not-found">
    <h2>Sala não encontrada</h2>
    <router-link :to="`/facilities/${facilityId}/rooms`" class="btn-primary">Voltar para Salas</router-link>
  </div>
</template>

<style scoped>
.room-detail {
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

.facility-name {
  color: #666;
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

.status-occupied {
  background-color: #bbdefb;
  color: #1976d2;
}

.status-maintenance {
  background-color: #fff9c4;
  color: #fbc02d;
}

.status-reserved {
  background-color: #e0e0e0;
  color: #616161;
}

.status-operational {
  background-color: #c8e6c9;
  color: #388e3c;
}

.status-broken {
  background-color: #ffcdd2;
  color: #d32f2f;
}

.status-retired {
  background-color: #e0e0e0;
  color: #616161;
}

.status-scheduled {
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

.room-overview {
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

.room-section {
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