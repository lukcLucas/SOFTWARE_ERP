<script setup lang="ts">
import { computed } from 'vue';
import { useInvoiceStore } from '../stores/invoices';
import { useCustomerStore } from '../stores/customers';
import { useProductStore } from '../stores/products';
import { useProjectStore } from '../stores/projects';
import { useVehicleStore } from '../stores/vehicles';
import { useDriverStore } from '../stores/drivers';
import { useRouteStore } from '../stores/routes';
import { useFacilityStore } from '../stores/facilities';

const invoiceStore = useInvoiceStore();
const customerStore = useCustomerStore();
const productStore = useProductStore();
const projectStore = useProjectStore();
const vehicleStore = useVehicleStore();
const driverStore = useDriverStore();
const routeStore = useRouteStore();
const facilityStore = useFacilityStore();

const totalInvoices = computed(() => invoiceStore.invoices.length);
const totalCustomers = computed(() => customerStore.customers.length);
const totalProducts = computed(() => productStore.products.length);
const totalProjects = computed(() => projectStore.projects.length);
const totalVehicles = computed(() => vehicleStore.vehicles.length);
const totalDrivers = computed(() => driverStore.drivers.length);
const activeRoutes = computed(() => routeStore.routes.filter(r => r.status === 'in_progress').length);
const totalFacilities = computed(() => facilityStore.facilities.length);
const upcomingMaintenances = computed(() => {
  let count = 0;
  facilityStore.facilities.forEach(facility => {
    count += facility.maintenanceRecords.filter(record => record.status === 'scheduled').length;
  });
  return count;
});

const totalRevenue = computed(() => {
  return invoiceStore.invoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((total, invoice) => {
      return total + invoiceStore.calculateInvoiceTotal(invoice.id);
    }, 0);
});

const pendingInvoices = computed(() => {
  return invoiceStore.invoices.filter(invoice => invoice.status === 'sent').length;
});

const activeProjects = computed(() => {
  return projectStore.projects.filter(project => project.status === 'in_progress').length;
});

const vehiclesInMaintenance = computed(() => {
  return vehicleStore.vehicles.filter(v => v.status === 'maintenance').length;
});

const vehiclesNeedingMaintenance = computed(() => {
  // This is a placeholder - in a real app, we would check dates
  return 0;
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
</script>

<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <h3>Total de Faturas</h3>
          <p class="stat-value">{{ totalInvoices }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <h3>Receita Total</h3>
          <p class="stat-value">{{ formatCurrency(totalRevenue) }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <h3>Clientes</h3>
          <p class="stat-value">{{ totalCustomers }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📦</div>
        <div class="stat-content">
          <h3>Produtos</h3>
          <p class="stat-value">{{ totalProducts }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🔨</div>
        <div class="stat-content">
          <h3>Projetos</h3>
          <p class="stat-value">{{ totalProjects }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">⚙️</div>
        <div class="stat-content">
          <h3>Projetos Ativos</h3>
          <p class="stat-value">{{ activeProjects }}</p>
        </div>
      </div>
      
      <!-- Fleet Management Stats -->
      <div class="stat-card">
        <div class="stat-icon">🚚</div>
        <div class="stat-content">
          <h3>Veículos</h3>
          <p class="stat-value">{{ totalVehicles }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">👨‍✈️</div>
        <div class="stat-content">
          <h3>Motoristas</h3>
          <p class="stat-value">{{ totalDrivers }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🗺️</div>
        <div class="stat-content">
          <h3>Rotas Ativas</h3>
          <p class="stat-value">{{ activeRoutes }}</p>
        </div>
      </div>
      
      <!-- Facilities Management Stats -->
      <div class="stat-card">
        <div class="stat-icon">🏢</div>
        <div class="stat-content">
          <h3>Instalações</h3>
          <p class="stat-value">{{ totalFacilities }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🔧</div>
        <div class="stat-content">
          <h3>Manutenções Agendadas</h3>
          <p class="stat-value">{{ upcomingMaintenances }}</p>
        </div>
      </div>
    </div>
    
    <div class="dashboard-sections">
      <div class="dashboard-section">
        <h2>Faturas Pendentes</h2>
        <p>Você tem {{ pendingInvoices }} faturas pendentes de pagamento.</p>
        <router-link to="/invoices" class="btn-primary">Ver Faturas</router-link>
      </div>
      
      <div class="dashboard-section">
        <h2>Projetos Ativos</h2>
        <p>Você tem {{ activeProjects }} projetos em andamento.</p>
        <router-link to="/projects" class="btn-primary">Ver Projetos</router-link>
      </div>
      
      <!-- Fleet Management Sections -->
      <div class="dashboard-section">
        <h2>Manutenção de Veículos</h2>
        <p>{{ vehiclesInMaintenance }} veículos em manutenção.</p>
        <p>{{ vehiclesNeedingMaintenance }} veículos precisam de manutenção.</p>
        <router-link to="/fleet" class="btn-primary">Ver Veículos</router-link>
      </div>
      
      <div class="dashboard-section">
        <h2>Rotas de Entrega</h2>
        <p>{{ activeRoutes }} rotas ativas no momento.</p>
        <router-link to="/fleet/routes" class="btn-primary">Ver Rotas</router-link>
      </div>
      
      <!-- Facilities Management Sections -->
      <div class="dashboard-section">
        <h2>Gestão de Facilities</h2>
        <p>{{ upcomingMaintenances }} manutenções agendadas.</p>
        <p>{{ totalFacilities }} instalações gerenciadas.</p>
        <router-link to="/facilities" class="btn-primary">Ver Instalações</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 1.5rem;
}

h1 {
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  align-items: center;
}

.stat-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  margin: 0;
  font-size: 1rem;
  color: #666;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0.5rem 0 0;
}

.dashboard-sections {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.dashboard-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.dashboard-section h2 {
  margin-top: 0;
  font-size: 1.4rem;
}

.btn-primary {
  display: inline-block;
  background-color: #3498db;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  margin-top: 1rem;
}
</style>