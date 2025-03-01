<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCustomerStore } from '../stores/customers';
import { useProductStore } from '../stores/products';
import { useInvoiceStore } from '../stores/invoices';
import { format, addDays } from 'date-fns';
import type { InvoiceItem } from '../types';

const router = useRouter();
const customerStore = useCustomerStore();
const productStore = useProductStore();
const invoiceStore = useInvoiceStore();

const customers = computed(() => customerStore.customers);
const products = computed(() => productStore.products);

const selectedCustomerId = ref('');
const invoiceDate = ref(format(new Date(), 'yyyy-MM-dd'));
const dueDate = ref(format(addDays(new Date(), 30), 'yyyy-MM-dd'));
const notes = ref('');
const items = ref<InvoiceItem[]>([]);

const selectedProduct = ref('');
const quantity = ref(1);

const addItem = () => {
  const product = productStore.products.find(p => p.id === selectedProduct.value);
  if (product) {
    items.value.push({
      id: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      quantity: quantity.value,
      unitPrice: product.price
    });
    selectedProduct.value = '';
    quantity.value = 1;
  }
};

const removeItem = (id: string) => {
  const index = items.value.findIndex(item => item.id === id);
  if (index !== -1) {
    items.value.splice(index, 1);
  }
};

const calculateTotal = () => {
  return items.value.reduce((total, item) => {
    return total + (item.quantity * item.unitPrice);
  }, 0);
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const saveInvoice = () => {
  if (!selectedCustomerId.value || items.value.length === 0) {
    alert('Por favor, selecione um cliente e adicione pelo menos um item.');
    return;
  }

  const customer = customerStore.customers.find(c => c.id === selectedCustomerId.value);
  if (!customer) return;

  const newInvoice = {
    customerId: customer.id,
    customerName: customer.name,
    date: invoiceDate.value,
    dueDate: dueDate.value,
    items: items.value,
    status: 'draft' as const,
    notes: notes.value
  };

  invoiceStore.addInvoice(newInvoice);
  router.push('/invoices');
};
</script>

<template>
  <div class="create-invoice">
    <div class="page-header">
      <h1>Nova Fatura</h1>
    </div>
    
    <div class="invoice-form">
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
        
        <div class="form-row">
          <div class="form-group">
            <label for="invoiceDate">Data de Emissão</label>
            <input type="date" id="invoiceDate" v-model="invoiceDate" required>
          </div>
          
          <div class="form-group">
            <label for="dueDate">Data de Vencimento</label>
            <input type="date" id="dueDate" v-model="dueDate" required>
          </div>
        </div>
        
        <div class="form-group">
          <label for="notes">Observações</label>
          <textarea id="notes" v-model="notes"></textarea>
        </div>
      </div>
      
      <div class="form-section">
        <h3>Itens da Fatura</h3>
        
        <div class="add-item-form">
          <div class="form-row">
            <div class="form-group product-select">
              <label for="product">Produto</label>
              <select id="product" v-model="selectedProduct">
                <option value="" disabled>Selecione um produto</option>
                <option v-for="product in products" :key="product.id" :value="product.id">
                  {{ product.name }} - {{ formatCurrency(product.price) }}
                </option>
              </select>
            </div>
            
            <div class="form-group quantity-input">
              <label for="quantity">Quantidade</label>
              <input type="number" id="quantity" v-model="quantity" min="1" required>
            </div>
            
            <div class="add-btn-container">
              <button @click="addItem" class="btn-add" :disabled="!selectedProduct">
                Adicionar Item
              </button>
            </div>
          </div>
        </div>
        
        <div class="items-list" v-if="items.length > 0">
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Preço Unitário</th>
                <th>Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td>{{ item.productName }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ formatCurrency(item.unitPrice) }}</td>
                <td>{{ formatCurrency(item.quantity * item.unitPrice) }}</td>
                <td>
                  <button @click="removeItem(item.id)" class="btn-remove">Remover</button>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="total-label">Total</td>
                <td colspan="2" class="total-value">{{ formatCurrency(calculateTotal()) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div class="no-items" v-else>
          <p>Nenhum item adicionado à fatura.</p>
        </div>
      </div>
      
      <div class="form-actions">
        <router-link to="/invoices" class="btn-secondary">Cancelar</router-link>
        <button @click="saveInvoice" class="btn-primary" :disabled="items.length === 0 || !selectedCustomerId">
          Salvar Fatura
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.create-invoice {
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 1.5rem;
}

h1 {
  margin: 0;
}

.invoice-form {
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

.add-item-form {
  margin-bottom: 1.5rem;
}

.product-select {
  flex: 3;
}

.quantity-input {
  flex: 1;
}

.add-btn-container {
  display: flex;
  align-items: flex-end;
  padding-bottom: 0.5rem;
}

.items-list {
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