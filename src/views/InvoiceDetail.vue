<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useInvoiceStore } from '../stores/invoices';

const route = useRoute();
const router = useRouter();
const invoiceStore = useInvoiceStore();

const invoiceId = computed(() => route.params.id as string);
const invoice = computed(() => {
  return invoiceStore.invoices.find(inv => inv.id === invoiceId.value);
});

const total = computed(() => {
  if (!invoice.value) return 0;
  return invoiceStore.calculateInvoiceTotal(invoice.value.id);
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'draft': return 'Rascunho';
    case 'sent': return 'Enviada';
    case 'paid': return 'Paga';
    case 'overdue': return 'Vencida';
    default: return status;
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'draft': return 'status-draft';
    case 'sent': return 'status-sent';
    case 'paid': return 'status-paid';
    case 'overdue': return 'status-overdue';
    default: return '';
  }
};

const updateStatus = (newStatus: 'draft' | 'sent' | 'paid' | 'overdue') => {
  if (invoice.value) {
    invoiceStore.updateInvoice(invoice.value.id, { status: newStatus });
  }
};

const deleteInvoice = () => {
  if (confirm('Tem certeza que deseja excluir esta fatura?')) {
    if (invoice.value) {
      invoiceStore.deleteInvoice(invoice.value.id);
      router.push('/invoices');
    }
  }
};
</script>

<template>
  <div class="invoice-detail" v-if="invoice">
    <div class="page-header">
      <div>
        <h1>Fatura #{{ invoice.id }}</h1>
        <span :class="['status-badge', getStatusClass(invoice.status)]">
          {{ getStatusLabel(invoice.status) }}
        </span>
      </div>
      <div class="header-actions">
        <button @click="deleteInvoice" class="btn-delete">Excluir</button>
        <div class="status-actions">
          <button 
            v-if="invoice.status !== 'paid'" 
            @click="updateStatus('paid')" 
            class="btn-success"
          >
            Marcar como Paga
          </button>
          <button 
            v-if="invoice.status !== 'sent'" 
            @click="updateStatus('sent')" 
            class="btn-primary"
          >
            Marcar como Enviada
          </button>
        </div>
      </div>
    </div>
    
    <div class="invoice-info">
      <div class="info-section">
        <h3>Detalhes do Cliente</h3>
        <p><strong>Nome:</strong> {{ invoice.customerName }}</p>
      </div>
      
      <div class="info-section">
        <h3>Detalhes da Fatura</h3>
        <p><strong>Data de Emissão:</strong> {{ invoice.date }}</p>
        <p><strong>Data de Vencimento:</strong> {{ invoice.dueDate }}</p>
      </div>
    </div>
    
    <div class="invoice-items">
      <h3>Itens</h3>
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Preço Unitário</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in invoice.items" :key="item.id">
            <td>{{ item.productName }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ formatCurrency(item.unitPrice) }}</td>
            <td>{{ formatCurrency(item.quantity * item.unitPrice) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="total-label">Total</td>
            <td class="total-value">{{ formatCurrency(total) }}</td>
          </tr>
        </tfoot>
      </table>
    </div>
    
    <div class="invoice-notes" v-if="invoice.notes">
      <h3>Observações</h3>
      <p>{{ invoice.notes }}</p>
    </div>
  </div>
  <div v-else class="not-found">
    <h2>Fatura não encontrada</h2>
    <router-link to="/invoices" class="btn-primary">Voltar para Faturas</router-link>
  </div>
</template>

<style scoped>
.invoice-detail {
  padding: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
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

.status-draft {
  background-color: #e0e0e0;
  color: #616161;
}

.status-sent {
  background-color: #bbdefb;
  color: #1976d2;
}

.status-paid {
  background-color: #c8e6c9;
  color: #388e3c;
}

.status-overdue {
  background-color: #ffcdd2;
  color: #d32f2f;
}

.invoice-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.info-section h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.invoice-items, .invoice-notes {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.invoice-items h3, .invoice-notes h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.2rem;
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

.btn-success {
  background-color: #2ecc71;
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
</style>