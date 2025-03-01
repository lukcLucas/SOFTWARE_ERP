<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCustomerStore } from '../stores/customers';
import { useProjectStore } from '../stores/projects';
import { format, addDays, addMonths } from 'date-fns';
import type { Project, ProjectTask, ProjectResource } from '../types';

const router = useRouter();
const customerStore = useCustomerStore();
const projectStore = useProjectStore();

const customers = computed(() => customerStore.customers);

// Project form data
const selectedCustomerId = ref('');
const projectName = ref('');
const projectDescription = ref('');
const startDate = ref(format(new Date(), 'yyyy-MM-dd'));
const endDate = ref(format(addMonths(new Date(), 1), 'yyyy-MM-dd'));
const budget = ref(0);

// Task form data
const tasks = ref<Omit<ProjectTask, 'id'>[]>([]);
const taskName = ref('');
const taskDescription = ref('');
const taskStartDate = ref(format(new Date(), 'yyyy-MM-dd'));
const taskEndDate = ref(format(addDays(new Date(), 15), 'yyyy-MM-dd'));
const taskStatus = ref<'pending' | 'in_progress' | 'completed' | 'delayed'>('pending');
const taskProgress = ref(0);
const taskAssignedTo = ref('');

const addTask = () => {
  if (!taskName.value) return;
  
  tasks.value.push({
    name: taskName.value,
    description: taskDescription.value,
    startDate: taskStartDate.value,
    endDate: taskEndDate.value,
    status: taskStatus.value,
    assignedTo: taskAssignedTo.value.split(',').map(name => name.trim()).filter(name => name),
    progress: taskProgress.value
  });
  
  // Reset form
  taskName.value = '';
  taskDescription.value = '';
  taskStartDate.value = format(new Date(), 'yyyy-MM-dd');
  taskEndDate.value = format(addDays(new Date(), 15), 'yyyy-MM-dd');
  taskStatus.value = 'pending';
  taskProgress.value = 0;
  taskAssignedTo.value = '';
};

const removeTask = (index: number) => {
  tasks.value.splice(index, 1);
};

// Resource form data
const resources = ref<Omit<ProjectResource, 'id'>[]>([]);
const resourceName = ref('');
const resourceType = ref<'human' | 'material' | 'service'>('human');
const resourceCost = ref(0);
const resourceQuantity = ref(1);

const addResource = () => {
  if (!resourceName.value) return;
  
  resources.value.push({
    name: resourceName.value,
    type: resourceType.value,
    cost: resourceCost.value,
    quantity: resourceQuantity.value
  });
  
  // Reset form
  resourceName.value = '';
  resourceType.value = 'human';
  resourceCost.value = 0;
  resourceQuantity.value = 1;
};

const removeResource = (index: number) => {
  resources.value.splice(index, 1);
};

const calculateTotalCost = () => {
  return resources.value.reduce((total, resource) => {
    return total + (resource.cost * resource.quantity);
  }, 0);
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const getResourceTypeLabel = (type: string) => {
  switch (type) {
    case 'human': return 'Humano';
    case 'material': return 'Material';
    case 'service': return 'Serviço';
    default: return type;
  }
};

const saveProject = () => {
  if (!selectedCustomerId.value || !projectName.value) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  const customer = customerStore.customers.find(c => c.id === selectedCustomerId.value);
  if (!customer) return;

  const newProject = {
    name: projectName.value,
    description: projectDescription.value,
    customerId: customer.id,
    customerName: customer.name,
    startDate: startDate.value,
    endDate: endDate.value,
    status: 'planning' as const,
    budget: budget.value,
    cost: calculateTotalCost(),
    tasks: tasks.value.map(task => ({
      ...task,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    })),
    resources: resources.value.map(resource => ({
      ...resource,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }))
  };

  projectStore.addProject(newProject);
  router.push('/projects');
};
</script>

<template>
  <div class="create-project">
    <div class="page-header">
      <h1>Novo Projeto</h1>
    </div>
    
    <div class="project-form">
      <div class="form-section">
        <h3>Informações Básicas</h3>
        
        <div class="form-group">
          <label for="customer">Cliente</label>
          <select id="customer" v-model="selectedCustomerId" required>
            <option value="" disabled>Selecione um cliente</option>
            <option v-for="customer in customers" :key="customer.id" :value="customer.id">
              {{ customer.name }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="projectName">Nome do Projeto</label>
          <input type="text" id="projectName" v-model="projectName" required>
        </div>
        
        <div class="form-group">
          <label for="projectDescription">Descrição</label>
          <textarea id="projectDescription" v-model="projectDescription" required></textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="startDate">Data de Início</label>
            <input type="date" id="startDate" v-model="startDate" required>
          </div>
          
          <div class="form-group">
            <label for="endDate">Data de Término</label>
            <input type="date" id="endDate" v-model="endDate" required>
          </div>
        </div>
        
        <div class="form-group">
          <label for="budget">Orçamento</label>
          <input type="number" id="budget" v-model="budget" min="0" step="0.01" required>
        </div>
      </div>
      
      <div class="form-section">
        <h3>Tarefas</h3>
        
        <div class="add-task-form">
          <div class="form-group">
            <label for="taskName">Nome da Tarefa</label>
            <input type="text" id="taskName" v-model="taskName">
          </div>
          
          <div class="form-group">
            <label for="taskDescription">Descrição da Tarefa</label>
            <textarea id="taskDescription" v-model="taskDescription"></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="taskStartDate">Data de Início</label>
              <input type="date" id="taskStartDate" v-model="taskStartDate">
            </div>
            
            <div class="form-group">
              <label for="taskEndDate">Data de Término</label>
              <input type="date" id="taskEndDate" v-model="taskEndDate">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="taskStatus">Status</label>
              <select id="taskStatus" v-model="taskStatus">
                <option value="pending">Pendente</option>
                <option value="in_progress">Em Andamento</option>
                <option value="completed">Concluído</option>
                <option value="delayed">Atrasado</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="taskProgress">Progresso (%)</label>
              <input type="number" id="taskProgress" v-model="taskProgress" min="0" max="100">
            </div>
          </div>
          
          <div class="form-group">
            <label for="taskAssignedTo">Responsáveis (separados por vírgula)</label>
            <input type="text" id="taskAssignedTo" v-model="taskAssignedTo">
          </div>
          
          <div class="form-actions">
            <button @click="addTask" class="btn-add" type="button">Adicionar Tarefa</button>
          </div>
        </div>
        
        <div class="tasks-list" v-if="tasks.length > 0">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Responsáveis</th>
                <th>Datas</th>
                <th>Status</th>
                <th>Progresso</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(task, index) in tasks" :key="index">
                <td>{{ task.name }}</td>
                <td>{{ task.assignedTo.join(', ') }}</td>
                <td>{{ task.startDate }} a {{ task.endDate }}</td>
                <td>{{ task.status }}</td>
                <td>{{ task.progress }}%</td>
                <td>
                  <button @click="removeTask(index)" class="btn-remove">Remover</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="no-items" v-else>
          <p>Nenhuma tarefa adicionada ao projeto.</p>
        </div>
      </div>
      
      <div class="form-section">
        <h3>Recursos</h3>
        
        <div class="add-resource-form">
          <div class="form-row">
            <div class="form-group resource-name">
              <label for="resourceName">Nome do Recurso</label>
              <input type="text" id="resourceName" v-model="resourceName">
            </div>
            
            <div class="form-group resource-type">
              <label for="resourceType">Tipo</label>
              <select id="resourceType" v-model="resourceType">
                <option value="human">Humano</option>
                <option value="material">Material</option>
                <option value="service">Serviço</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="resourceCost">Custo</label>
              <input type="number" id="resourceCost" v-model="resourceCost" min="0" step="0.01">
            </div>
            
            <div class="form-group">
              <label for="resourceQuantity">Quantidade</label>
              <input type="number" id="resourceQuantity" v-model="resourceQuantity" min="1">
            </div>
          </div>
          
          <div class="form-actions">
            <button @click="addResource" class="btn-add" type="button">Adicionar Recurso</button>
          </div>
        </div>
        
        <div class="resources-list" v-if="resources.length > 0">
          <table>
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
              <tr v-for="(resource, index) in resources" :key="index">
                <td>{{ resource.name }}</td>
                <td>{{ getResourceTypeLabel(resource.type) }}</td>
                <td>{{ resource.quantity }}</td>
                <td>{{ formatCurrency(resource.cost) }}</td>
                <td>{{ formatCurrency(resource.cost * resource.quantity) }}</td>
                <td>
                  <button @click="removeResource(index)" class="btn-remove">Remover</button>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" class="total-label">Custo Total</td>
                <td colspan="2" class="total-value">{{ formatCurrency(calculateTotalCost()) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div class="no-items" v-else>
          <p>Nenhum recurso adicionado ao projeto.</p>
        </div>
      </div>
      
      <div class="form-actions">
        <router-link to="/projects" class="btn-secondary">Cancelar</router-link>
        <button @click="saveProject" class="btn-primary">Salvar Projeto</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.create-project {
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 1.5rem;
}

h1 {
  margin: 0;
}

.project-form {
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

.resource-name {
  flex: 2;
}

.resource-type {
  flex: 1;
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

.add-task-form, .add-resource-form {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.tasks-list, .resources-list {
  margin-bottom: 1rem;
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

.no-items {
  background-color: #f9f9f9;
  padding: 1.5rem;
  text-align: center;
  border-radius: 4px;
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

.btn-primary:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
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

.btn-add {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}

.btn-add:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.btn-remove {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}
</style>