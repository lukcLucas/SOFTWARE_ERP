<script setup lang="ts">
import { ref } from 'vue';
import { useProductStore } from '../stores/products';
import type { Product } from '../types';

const productStore = useProductStore();
const products = productStore.products;

const showForm = ref(false);
const editingProductId = ref<string | null>(null);

const newProduct = ref<Omit<Product, 'id'>>({
  name: '',
  description: '',
  price: 0,
  stock: 0
});

const resetForm = () => {
  newProduct.value = {
    name: '',
    description: '',
    price: 0,
    stock: 0
  };
  editingProductId.value = null;
};

const openAddForm = () => {
  resetForm();
  showForm.value = true;
};

const openEditForm = (product: Product) => {
  newProduct.value = {
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock
  };
  editingProductId.value = product.id;
  showForm.value = true;
};

const saveProduct = () => {
  if (editingProductId.value) {
    productStore.updateProduct(editingProductId.value, newProduct.value);
  } else {
    productStore.addProduct(newProduct.value);
  }
  showForm.value = false;
  resetForm();
};

const deleteProduct = (id: string) => {
  if (confirm('Tem certeza que deseja excluir este produto?')) {
    productStore.deleteProduct(id);
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
</script>

<template>
  <div class="products-page">
    <div class="page-header">
      <h1>Produtos</h1>
      <button @click="openAddForm" class="btn-primary">Adicionar Produto</button>
    </div>

    <div v-if="showForm" class="form-container">
      <h2>{{ editingProductId ? 'Editar' : 'Adicionar' }} Produto</h2>
      <form @submit.prevent="saveProduct">
        <div class="form-group">
          <label for="name">Nome</label>
          <input type="text" id="name" v-model="newProduct.name" required>
        </div>
        <div class="form-group">
          <label for="description">Descrição</label>
          <textarea id="description" v-model="newProduct.description" required></textarea>
        </div>
        <div class="form-group">
          <label for="price">Preço</label>
          <input type="number" id="price" v-model="newProduct.price" step="0.01" min="0" required>
        </div>
        <div class="form-group">
          <label for="stock">Estoque</label>
          <input type="number" id="stock" v-model="newProduct.stock" min="0" required>
        </div>
        <div class="form-actions">
          <button type="button" @click="showForm = false" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">Salvar</button>
        </div>
      </form>
    </div>

    <div class="products-list">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.name }}</td>
            <td>{{ product.description }}</td>
            <td>{{ formatCurrency(product.price) }}</td>
            <td>{{ product.stock }}</td>
            <td class="actions">
              <button @click="openEditForm(product)" class="btn-edit">Editar</button>
              <button @click="deleteProduct(product.id)" class="btn-delete">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.products-page {
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

.products-list {
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