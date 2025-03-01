<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProjectStore } from '../stores/projects';
import { useCustomerStore } from '../stores/customers';
import type { ProjectTask, ProjectResource } from '../types';

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();
const customerStore = useCustomerStore();

const projectId = computed(() => route.params.id as string);
const project = computed(() => {
  return projectStore.projects.find(p => p.id === projectId.value);
});

const customer = computed(() => {
  if (!project.value) return null;
  return customerStore.customers.find(c => c.id === project.value?.customerId);
});

const progress = computed(() => {
  if (!project.value) return 0;
  return projectStore.calculateProjectProgress(project.value.id);
});

const totalCost = computed(() => {
  if (!project.value) return 0;
  return projectStore.calculateTotalCost(project.value.id);
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'planning': return 'status-planning';
    case 'in_progress': return 'status-in-progress';
    case 'completed': return 'status-completed';
    case 'on_hold': return 'status-on-hold';
    case 'cancelled': return 'status-cancelled';
    case 'pending': return 'status-pending';
    case 'delayed': return 'status-delayed';
    default: return '';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'planning': return 'Planejamento';
    case 'in_progress': return 'Em Andamento';
    case 'completed': return 'Concluído';
    case 'on_hold': return 'Em Espera';
    case 'cancelled': return 'Cancelado';
    case 'pending': return 'Pendente';
    case 'delayed': return 'Atrasado';
    default: return status;
  }
};

const getResourceTypeLabel = (type: string) => {
  switch (type) {
    case 'human': return 'Humano';
    case 'material': return 'Material';
    case 'service': return 'Serviço';
    default: return type;
  }
};

const deleteProject = () => {
  if (confirm('Tem certeza que deseja excluir este projeto?')) {
    if (project.value) {
      projectStore.deleteProject(project.value.id);
      router.push('/projects');
    }
  }
};

// Task management
const showTaskForm = ref(false);
const editingTaskId = ref<string | null>(null);
const newTask = ref<Omit<ProjectTask, 'id'>>({
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  status: 'pending',
  assignedTo: [],
  progress: 0
});

const resetTaskForm = () => {
  newTask.value = {
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'pending',
    assignedTo: [],
    progress: 0
  };
  editingTaskId.value = null;
};

const openAddTaskForm = () => {
  resetTaskForm();
  showTaskForm.value = true;
};

const openEditTaskForm = (task: ProjectTask) => {
  newTask.value = {
    name: task.name,
    description: task.description,
    startDate: task.startDate,
    endDate: task.endDate,
    status: task.status,
    assignedTo: [...task.assignedTo],
    progress: task.progress
  };
  editingTaskId.value = task.id;
  showTaskForm.value = true;
};

const saveTask = () => {
  if (!project.value) return;
  
  if (editingTaskId.value) {
    projectStore.updateTask(project.value.id, editingTaskId.value, newTask.value);
  } else {
    projectStore.addTask(project.value.id, newTask.value);
  }
  showTaskForm.value = false;
  resetTaskForm();
};

const deleteTask = (taskId: string) => {
  if (!project.value) return;
  
  if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
    projectStore.deleteTask(project.value.id, taskId);
  }
};

// Resource management
const showResourceForm = ref(false);
const editingResourceId = ref<string | null>(null);
const newResource = ref<Omit<ProjectResource, 'id'>>({
  name: '',
  type: 'human',
  cost: 0,
  quantity: 1
});

const resetResourceForm = () => {
  newResource.value = {
    name: '',
    type: 'human',
    cost: 0,
    quantity: 1
  };
  editingResourceId.value = null;
};

const openAddResourceForm = () => {
  resetResourceForm();
  showResourceForm.value = true;
};

const openEditResourceForm = (resource: ProjectResource) => {
  newResource.value = {
    name: resource.name,
    type: resource.type,
    cost: resource.cost,
    quantity: resource.quantity
  };
  editingResourceId.value = resource.id;
  showResourceForm.value = true;
};

const saveResource = () => {
  if (!project.value) return;
  
  if (editingResourceId.value) {
    projectStore.updateResource(project.value.id, editingResourceId.value, newResource.value);
  } else {
    projectStore.addResource(project.value.id, newResource.value);
  }
  showResourceForm.value = false;
  resetResourceForm();
};

const deleteResource = (resourceId: string) => {
  if (!project.value) return;
  
  if (confirm('Tem certeza que deseja excluir este recurso?')) {
    projectStore.deleteResource(project.value.id, resourceId);
  }
};

// Update project status
const updateStatus = (newStatus: 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled') => {
  if (project.value) {
    projectStore.updateProject(project.value.id, { status: newStatus });
  }
};
</script>

<template>
  <div class="project-detail" v-if="project">
    <div class="page-header">
      <div>
        <h1>{{ project.name }}</h1>
        <span :class="['status-badge', getStatusClass(project.status)]">
          {{ getStatusLabel(project.status) }}
        </span>
      </div>
      <div class="header-actions">
        <button @click="deleteProject" class="btn-delete">Excluir</button>
        <div class="status-actions">
          <button 
            v-if="project.status !== 'completed'" 
            @click="updateStatus('completed')" 
            class="btn-success"
          >
            Marcar como Concluído
          </button>
          <button 
            v-if="project.status !== 'in_progress'" 
            @click="updateStatus('in_progress')" 
            class="btn-primary"
          >
            Marcar como Em Andamento
          </button>
          <button 
            v-if="project.status !== 'on_hold'" 
            @click="updateStatus('on_hold')" 
            class="btn-warning"
          >
            Colocar em Espera
          </button>
        </div>
      </div>
    </div>
    
    <div class="project-overview">
      <div class="overview-card">
        <h3>Progresso</h3>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
          <span class="progress-text">{{ progress }}%</span>
        </div>
      </div>
      
      <div class="overview-card">
        <h3>Orçamento</h3>
        <div class="budget-info">
          <div class="budget-item">
            <span>Orçado:</span>
            <span class="budget-value">{{ formatCurrency(project.budget) }}</span>
          </div>
          <div class="budget-item">
            <span>Custo Atual:</span>
            <span class="budget-value">{{ formatCurrency(totalCost) }}</span>
          </div>
          <div class="budget-item">
            <span>Saldo:</span>
            <span :class="['budget-value', project.budget - totalCost < 0 ? 'negative' : 'positive']">
              {{ formatCurrency(project.budget - totalCost) }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="overview-card">
        <h3>Datas</h3>
        <div class="dates-info">
          <div class="date-item">
            <span>Início:</span>
            <span>{{ project.startDate }}</span>
          </div>
          <div class="date-item">
            <span>Término:</span>
            <span>{{ project.endDate }}</span>
          </div>
        </div>
      </div>
      
      <div class="overview-card">
        <h3>Cliente</h3>
        <div class="customer-info">
          <p>{{ project.customerName }}</p>
          <p v-if="customer">{{ customer.email }}</p>
          <p v-if="customer">{{ customer.phone }}</p>
        </div>
      </div>
    </div>
    
    <div class="project-description">
      <h3>Descrição</h3>
      <p>{{ project.description }}</p>
    </div>
    
    <div class="project-tasks">
      <div class="section-header">
        <h3>Tarefas</h3>
        <button @click="openAddTaskForm" class="btn-add">Adicionar Tarefa</button>
      </div>
      
      <div v-if="showTaskForm" class="form-container">
        <h4>{{ editingTaskId ? 'Editar' : 'Adicionar' }} Tarefa</h4>
        <form @submit.prevent="saveTask">
          <div class="form-group">
            <label for="taskName">Nome</label>
            <input type="text" id="taskName" v-model="newTask.name" required>
          </div>
          <div class="form-group">
            <label for="taskDescription">Descrição</label>
            <textarea id="taskDescription" v-model="newTask.description" required></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="taskStartDate">Data de Início</label>
              <input type="date" id="taskStartDate" v-model="newTask.startDate" required>
            </div>
            <div class="form-group">
              <label for="taskEndDate">Data de Término</label>
              <input type="date" id="taskEndDate" v-model="newTask.endDate" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="taskStatus">Status</label>
              <select id="taskStatus" v-model="newTask.status" required>
                <option value="pending">Pendente</option>
                <option value="in_progress">Em Andamento</option>
                <option value="completed">Concluído</option>
                <option value="delayed">Atrasado</option>
              </select>
            </div>
            <div class="form-group">
              <label for="taskProgress">Progresso (%)</label>
              <input type="number" id="taskProgress" v-model="newTask.progress" min="0" max="100" required>
            </div>
          </div>
          <div class="form-group">
            <label for="taskAssignedTo">Responsáveis (separados por vírgula)</label>
            <input type="text" id="taskAssignedTo" v-model="newTask.assignedTo" required>
          </div>
          <div class="form-actions">
            <button type="button" @click="showTaskForm = false" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary">Salvar</button>
          </div>
        </form>
      </div>
      
      <table v-if="project.tasks.length > 0">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Responsáveis</th>
            <th>Início</th>
            <th>Término</th>
            <th>Progresso</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in project.tasks" :key="task.id">
            <td>{{ task.name }}</td>
            <td>{{ task.assignedTo.join(', ') }}</td>
            <td>{{ task.startDate }}</td>
            <td>{{ task.endDate }}</td>
            <td>
              <div class="progress-bar small">
                <div class="progress-fill" :style="{ width: `${task.progress}%` }"></div>
                <span class="progress-text">{{ task.progress }}%</span>
              </div>
            </td>
            <td>
              <span :class="['status-badge', getStatusClass(task.status)]">
                {{ getStatusLabel(task.status) }}
              </span>
            </td>
            <td class="actions">
              <button @click="openEditTaskForm(task)" class="btn-edit">Editar</button>
              <button @click="deleteTask(task.id)" class="btn-delete">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">
        <p>Nenhuma tarefa cadastrada para este projeto.</p>
      </div>
    </div>
    
    <div class="project-resources">
      <div class="section-header">
        <h3>Recursos</h3>
        <button @click="openAddResourceForm" class="btn-add">Adicionar Recurso</button>
      </div>
      
      <div v-if="showResourceForm" class="form-container">
        <h4>{{ editingResourceId ? 'Editar' : 'Adicionar' }} Recurso</h4>
        <form @submit.prevent="saveResource">
          <div class="form-group">
            <label for="resourceName">Nome</label>
            <input type="text" id="resourceName" v-model="newResource.name" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="resourceType">Tipo</label>
              <select id="resourceType" v-model="newResource.type" required>
                <option value="human">Humano</option>
                <option value="material">Material</option>
                <option value="service">Serviço</option>
              </select>
            </div>
            <div class="form-group">
              <label for="resourceQuantity">Quantidade</label>
              <input type="number" id="resourceQuantity" v-model="newResource.quantity" min="1" required>
            </div>
          </div>
          <div class="form-group">
            <label for="resourceCost">Custo</label>
            <input type="number" id="resourceCost" v-model="newResource.cost" min="0" step="0.01" required>
          </div>
          <div class="form-actions">
            <button type="button" @click="showResourceForm = false" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary">Salvar</button>
          </div>
        </form>
      </div>
      
      <table v-if="project.resources.length > 0">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Quantidade</th>
            <th>Custo Unitário</th>
            <th>Custo Total</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="resource in project.resources" :key="resource.id">
            <td>{{ resource.name }}</td>
            <td>{{ getResourceTypeLabel(resource.type) }}</td>
            <td>{{ resource.quantity }}</td>
            <td>{{ formatCurrency(resource.cost) }}</td>
            <td>{{ formatCurrency(resource.cost * resource.quantity) }}</td>
            <td class="actions">
              <button @click="openEditResourceForm(resource)" class="btn-edit">Editar</button>
              <button @click="deleteResource(resource.id)" class="btn-delete">Excluir</button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4" class="total-label">Custo Total</td>
            <td colspan="2" class="total-value">{{ formatCurrency(totalCost) }}</td>
          </tr>
        </tfoot>
      </table>
      <div v-else class="empty-state">
        <p>Nenhum recurso cadastrado para este projeto.</p>
      </div>
    </div>
  </div>
  <div v-else class="not-found">
    <h2>Projeto não encontrado</h2>
    <router-link to="/projects" class="btn-primary">Voltar para Projetos</router-link>
  </div>
</template>

<style scoped>
.project-detail {
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

.status-planning {
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

.status-on-hold {
  background-color: #fff9c4;
  color: #fbc02d;
}

.status-cancelled {
  background-color: #ffcdd2;
  color: #d32f2f;
}

.status-pending {
  background-color: #e0e0e0;
  color: #616161;
}

.status-delayed {
  background-color: #ffcdd2;
  color: #d32f2f;
}

.project-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.progress-bar.small {
  height: 16px;
}

.progress-fill {
  height: 100%;
  background-color: #3498db;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 500;
  color: #333;
}

.budget-info, .dates-info, .customer-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.budget-item, .date-item {
  display: flex;
  justify-content: space-between;
}

.budget-value.positive {
  color: #388e3c;
}

.budget-value.negative {
  color: #d32f2f;
}

.project-description {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.project-description h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.project-tasks, .project-resources {
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

tfoot td {
  border-bottom: none;
  padding-top: 1rem;
}

.total-label {
  text-align: right;
  font-weight: 600;
}

.total-value {
  font-weight: 600;
  font-size: 1.1rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
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

.btn-edit {
  background-color: #f39c12;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}
</style>