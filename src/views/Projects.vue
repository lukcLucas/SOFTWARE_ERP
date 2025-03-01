<script setup lang="ts">
import { ref, computed } from 'vue';
import { useProjectStore } from '../stores/projects';
import { useCustomerStore } from '../stores/customers';
import { format } from 'date-fns';

const projectStore = useProjectStore();
const customerStore = useCustomerStore();

const projects = computed(() => projectStore.projects);
const customers = computed(() => customerStore.customers);

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
    default: return status;
  }
};

const calculateProgress = (projectId: string) => {
  return projectStore.calculateProjectProgress(projectId);
};
</script>

<template>
  <div class="projects-page">
    <div class="page-header">
      <h1>Projetos e Serviços</h1>
      <router-link to="/projects/create" class="btn-primary">Novo Projeto</router-link>
    </div>
    
    <div class="projects-list">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Cliente</th>
            <th>Início</th>
            <th>Término</th>
            <th>Orçamento</th>
            <th>Progresso</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project.id">
            <td>{{ project.name }}</td>
            <td>{{ project.customerName }}</td>
            <td>{{ project.startDate }}</td>
            <td>{{ project.endDate }}</td>
            <td>{{ formatCurrency(project.budget) }}</td>
            <td>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${calculateProgress(project.id)}%` }"></div>
                <span class="progress-text">{{ calculateProgress(project.id) }}%</span>
              </div>
            </td>
            <td>
              <span :class="['status-badge', getStatusClass(project.status)]">
                {{ getStatusLabel(project.status) }}
              </span>
            </td>
            <td class="actions">
              <router-link :to="`/projects/${project.id}`" class="btn-view">Ver</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.projects-page {
  padding: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

h1 {
  margin: 0;
}

.projects-list {
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

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
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
</style>