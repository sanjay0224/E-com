// src/store/cart.js
import { reactive } from 'vue';

export const cart = reactive({
  items: [],

  addItem(product) {
    const existingItem = this.items.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
  },

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
  },

  clearCart() {
    this.items = [];
  }
});
