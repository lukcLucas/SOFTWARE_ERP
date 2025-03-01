<script setup lang="ts">
import { RouterView } from 'vue-router';
import Sidebar from './components/Sidebar.vue';
</script>

<template>
  <div class="app-container">
    <Sidebar />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: #f5f7fa;
  color: #333;
}

.app-container {
  display: flex;
}

.main-content {
  flex: 1;
  margin-left: 250px;
  transition: margin-left 0.3s;
}

.sidebar.collapsed + .main-content {
  margin-left: 60px;
}
</style>