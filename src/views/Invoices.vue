<script setup lang="ts">
import InvoiceList from '../components/InvoiceList.vue';
</script>

<template>
  <div class="invoices-page">
    <div class="page-header">
      <h1>Faturas</h1>
      <router-link to="/invoices/create" class="btn-primary">Nova Fatura</router-link>
    </div>
    
    <div class="invoices-container">
      <InvoiceList />
    </div>
  </div>
</template>

<style scoped>
.invoices-page {
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

.invoices-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
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
</style>