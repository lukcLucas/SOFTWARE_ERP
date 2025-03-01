<script setup lang="ts">
import { ref } from 'vue';
import { useCustomerStore } from '../stores/customers';
import type { Customer } from '../types';

const customerStore = useCustomerStore();
const customers = customerStore.customers;

const showForm = ref(false);
const editingCustomerId = ref<string | null>(null);

const newCustomer = ref<Omit<Customer, 'id'>>({
  name: '',
  email: '',
  phone: '',
  address: ''
});

const resetForm = () => {
  newCustomer.value = {
    name: '',
    email: '',
    phone: '',
    address: ''
  };
  editingCustomerId.value = null;
};

const openAddForm = () => {
  resetForm();
  showForm.value = true;
};

const openEditForm = (customer: Customer) => {
  newCustomer.value = {
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address
  };
  editingCustomerId.value = customer.id;
  showForm.value = true;
};

const saveCustomer = () => {
  if (editingCustomerId.value) {
    customerStore.updateCustomer(editingCustomerId.value, newCustomer.value);
  } else {
    customerStore.addCustomer(newCustomer.value);
  }
  showForm.value = false;
  resetForm();
};

const deleteCustomer = (id: string) => {
  if (confirm('Tem certeza que deseja excluir este cliente?')) {
    customerStore.deleteCustomer(id);
  }
};
</script>

<template>
  <div class="customers-page">
    <div class="page-header">
      <h1>Clientes</h1>
      <button @click="openAddForm" class="btn-primary">Adicionar Cliente</button>
    </div>

    <div v-if="showForm" class="form-container">
      <h2>{{ editingCustomerId ? 'Editar' : 'Adicionar' }} Cliente</h2>
      <form @submit.prevent="saveCustomer">
        <div class="form-group">
          <label for="name">Nome</label>
          <input type="text" id="name" v-model="newCustomer.name" required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="newCustomer.email" required>
        </div>
        <div class="form-group">
          <label for="phone">Telefone</label>
          <input type="text" id="phone" v-model="newCustomer.phone" required>
        </div>
        <div class="form-group">
          <label for="address">Endereço</label>
          <textarea id="address" v-model="newCustomer.address" required></textarea>
        </div>
        <div class="form-actions">
          <button type="button" @click="showForm = false" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">Salvar</button>
        </div>
      </form>
    </div>

    <div class="customers-list">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Endereço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in customers" :key="customer.id">
            <td>{{ customer.name }}</td>
            <td>{{ customer.email }}</td>
            <td>{{ customer.phone }}</td>
            <td>{{ customer.address }}</td>
            <td class="actions">
              <button @click="openEditForm(customer)" class="btn-edit">Editar</button>
              <button @click="deleteCustomer(customer.id)" class="btn-delete">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.customers-page {
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

.form-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input, textarea {
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

.customers-list {
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

.btn-edit {
  background-color: #f39c12;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}
</style>