import { defineStore } from 'pinia';
import { ref } from 'vue';
import { format, addDays } from 'date-fns';
import type { Invoice, InvoiceItem } from '../types';

export const useInvoiceStore = defineStore('invoices', () => {
  const invoices = ref<Invoice[]>([
    {
      id: '1',
      customerId: '1',
      customerName: 'Empresa ABC Ltda',
      date: format(new Date(), 'yyyy-MM-dd'),
      dueDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
      items: [
        {
          id: '1',
          productId: '1',
          productName: 'Consultoria Básica',
          quantity: 10,
          unitPrice: 150
        },
        {
          id: '2',
          productId: '2',
          productName: 'Desenvolvimento Web',
          quantity: 5,
          unitPrice: 200
        }
      ],
      status: 'sent',
      notes: 'Pagamento em 30 dias'
    }
  ]);

  function addInvoice(invoice: Omit<Invoice, 'id'>) {
    const newInvoice = {
      ...invoice,
      id: Date.now().toString()
    };
    invoices.value.push(newInvoice);
    return newInvoice;
  }

  function updateInvoice(id: string, data: Partial<Invoice>) {
    const index = invoices.value.findIndex(i => i.id === id);
    if (index !== -1) {
      invoices.value[index] = { ...invoices.value[index], ...data };
      return invoices.value[index];
    }
    return null;
  }

  function deleteInvoice(id: string) {
    const index = invoices.value.findIndex(i => i.id === id);
    if (index !== -1) {
      invoices.value.splice(index, 1);
      return true;
    }
    return false;
  }

  function addInvoiceItem(invoiceId: string, item: Omit<InvoiceItem, 'id'>) {
    const invoice = invoices.value.find(i => i.id === invoiceId);
    if (invoice) {
      const newItem = {
        ...item,
        id: Date.now().toString()
      };
      invoice.items.push(newItem);
      return newItem;
    }
    return null;
  }

  function removeInvoiceItem(invoiceId: string, itemId: string) {
    const invoice = invoices.value.find(i => i.id === invoiceId);
    if (invoice) {
      const index = invoice.items.findIndex(item => item.id === itemId);
      if (index !== -1) {
        invoice.items.splice(index, 1);
        return true;
      }
    }
    return false;
  }

  function calculateInvoiceTotal(invoiceId: string) {
    const invoice = invoices.value.find(i => i.id === invoiceId);
    if (!invoice) return 0;
    
    return invoice.items.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice);
    }, 0);
  }

  return {
    invoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    addInvoiceItem,
    removeInvoiceItem,
    calculateInvoiceTotal
  };
});