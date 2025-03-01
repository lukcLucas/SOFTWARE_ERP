import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Product } from '../types';

export const useProductStore = defineStore('products', () => {
  const products = ref<Product[]>([
    {
      id: '1',
      name: 'Consultoria Básica',
      description: 'Serviço de consultoria básica (hora)',
      price: 150,
      stock: 999
    },
    {
      id: '2',
      name: 'Desenvolvimento Web',
      description: 'Serviço de desenvolvimento web (hora)',
      price: 200,
      stock: 999
    },
    {
      id: '3',
      name: 'Licença Software',
      description: 'Licença mensal de software',
      price: 99.90,
      stock: 50
    }
  ]);

  function addProduct(product: Omit<Product, 'id'>) {
    const newProduct = {
      ...product,
      id: Date.now().toString()
    };
    products.value.push(newProduct);
    return newProduct;
  }

  function updateProduct(id: string, data: Partial<Product>) {
    const index = products.value.findIndex(p => p.id === id);
    if (index !== -1) {
      products.value[index] = { ...products.value[index], ...data };
      return products.value[index];
    }
    return null;
  }

  function deleteProduct(id: string) {
    const index = products.value.findIndex(p => p.id === id);
    if (index !== -1) {
      products.value.splice(index, 1);
      return true;
    }
    return false;
  }

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct
  };
});