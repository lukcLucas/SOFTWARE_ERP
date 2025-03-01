import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Customer } from '../types';

export const useCustomerStore = defineStore('customers', () => {
  const customers = ref<Customer[]>([
    {
      id: '1',
      name: 'Empresa ABC Ltda',
      email: 'contato@empresaabc.com',
      phone: '(11) 1234-5678',
      address: 'Av. Paulista, 1000, São Paulo, SP'
    },
    {
      id: '2',
      name: 'Comércio XYZ',
      email: 'financeiro@xyz.com',
      phone: '(21) 9876-5432',
      address: 'Rua da Lapa, 200, Rio de Janeiro, RJ'
    }
  ]);

  function addCustomer(customer: Omit<Customer, 'id'>) {
    const newCustomer = {
      ...customer,
      id: Date.now().toString()
    };
    customers.value.push(newCustomer);
    return newCustomer;
  }

  function updateCustomer(id: string, data: Partial<Customer>) {
    const index = customers.value.findIndex(c => c.id === id);
    if (index !== -1) {
      customers.value[index] = { ...customers.value[index], ...data };
      return customers.value[index];
    }
    return null;
  }

  function deleteCustomer(id: string) {
    const index = customers.value.findIndex(c => c.id === id);
    if (index !== -1) {
      customers.value.splice(index, 1);
      return true;
    }
    return false;
  }

  return {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer
  };
});