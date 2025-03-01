<script setup lang="ts">
import { ref } from 'vue';

const isCollapsed = ref(false);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<template>
  <aside :class="['sidebar', { 'collapsed': isCollapsed }]">
    <div class="sidebar-header">
      <h2 v-if="!isCollapsed">Simple ERP</h2>
      <h2 v-else>ERP</h2>
      <button @click="toggleSidebar" class="toggle-btn">
        {{ isCollapsed ? '→' : '←' }}
      </button>
    </div>
    <nav class="sidebar-nav">
      <router-link to="/" class="nav-item">
        <span class="icon">📊</span>
        <span v-if="!isCollapsed" class="text">Dashboard</span>
      </router-link>
      <router-link to="/customers" class="nav-item">
        <span class="icon">👥</span>
        <span v-if="!isCollapsed" class="text">Clientes</span>
      </router-link>
      <router-link to="/products" class="nav-item">
        <span class="icon">📦</span>
        <span v-if="!isCollapsed" class="text">Produtos</span>
      </router-link>
      <router-link to="/invoices" class="nav-item">
        <span class="icon">📝</span>
        <span v-if="!isCollapsed" class="text">Faturas</span>
      </router-link>
      <router-link to="/projects" class="nav-item">
        <span class="icon">🔨</span>
        <span v-if="!isCollapsed" class="text">Projetos</span>
      </router-link>
      
      <!-- Fleet Management Section -->
      <div class="nav-section">
        <span v-if="!isCollapsed" class="section-title">Gestão de Frota</span>
      </div>
      <router-link to="/fleet" class="nav-item">
        <span class="icon">🚚</span>
        <span v-if="!isCollapsed" class="text">Veículos</span>
      </router-link>
      <router-link to="/fleet/drivers" class="nav-item">
        <span class="icon">👨‍✈️</span>
        <span v-if="!isCollapsed" class="text">Motoristas</span>
      </router-link>
      <router-link to="/fleet/routes" class="nav-item">
        <span class="icon">🗺️</span>
        <span v-if="!isCollapsed" class="text">Rotas</span>
      </router-link>
      
      <!-- Facilities Management Section -->
      <div class="nav-section">
        <span v-if="!isCollapsed" class="section-title">Gestão de Facilities</span>
      </div>
      <router-link to="/facilities" class="nav-item">
        <span class="icon">🏢</span>
        <span v-if="!isCollapsed" class="text">Instalações</span>
      </router-link>
      <router-link to="/facilities" class="nav-item">
        <span class="icon">🔧</span>
        <span v-if="!isCollapsed" class="text">Manutenção</span>
      </router-link>
      <router-link to="/facilities" class="nav-item">
        <span class="icon">📅</span>
        <span v-if="!isCollapsed" class="text">Reservas</span>
      </router-link>
      <router-link to="/facilities" class="nav-item">
        <span class="icon">⚡</span>
        <span v-if="!isCollapsed" class="text">Consumo</span>
      </router-link>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  background-color: #2c3e50;
  color: white;
  height: 100vh;
  width: 250px;
  transition: width 0.3s;
  position: fixed;
  left: 0;
  top: 0;
}

.sidebar.collapsed {
  width: 60px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #3d5166;
}

.toggle-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
}

.sidebar-nav {
  padding: 1rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  color: #ecf0f1;
  text-decoration: none;
  transition: background-color 0.2s;
}

.nav-item:hover {
  background-color: #3d5166;
}

.nav-item.router-link-active {
  background-color: #3498db;
}

.icon {
  margin-right: 0.8rem;
  font-size: 1.2rem;
}

.text {
  font-size: 1rem;
}

.nav-section {
  padding: 0.8rem 1rem 0.4rem;
  color: #95a5a6;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 0.5rem;
}

.section-title {
  font-weight: 600;
}
</style>