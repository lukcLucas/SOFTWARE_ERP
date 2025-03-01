<script setup lang="ts">
import { computed } from 'vue';
import { useInvoiceStore } from '../stores/invoices';

const invoiceStore = useInvoiceStore();

const invoices = computed(() => invoiceStore.invoices);

const getStatusClass = (status: string) => {
  switch (status) {
    case 'draft': return 'status-draft';
    case 'sent': return 'status-sent';
    case 'paid': return 'status-paid';
    case 'overdue': return 'status-overdue';
    default: return '';
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
  <div class="invoice-list">
    <table>
      <thead>
        <tr>
          <th>Nº</th>
          <th>Cliente</th>
          <th>Data</th>
          <th>Vencimento</th>
          <th>Valor</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="invoice in invoices" :key="invoice.id">
          <td>{{ invoice.id }}</td>
          <td>{{ invoice.customerName }}</td>
          <td>{{ invoice.date }}</td>
          <td>{{ invoice.dueDate }}</td>
          <td>{{ formatCurrency(invoiceStore.calculateInvoiceTotal(invoice.id)) }}</td>
          <td>
            <span :class="['status-badge', getStatusClass(invoice.status)]">
              {{ invoice.status === 'draft' ? 'Rascunho' : 
                 invoice.status === 'sent' ? 'Enviada' : 
                 invoice.status === 'paid' ? 'Paga' : 'Vencida' }}
            </span>
          </td>
          <td class="actions">
            <router-link :to="`/invoices/${invoice.id}`" class="btn btn-view">Ver</router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.invoice-list {
  width: 100%;
  overflow-x: auto;
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

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  text-decoration: none;
  cursor: pointer;
}

.btn-view {
  background-color: #2196f3;
  color: white;
}
</style>