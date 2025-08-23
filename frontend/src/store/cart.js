// src/store/cart.js
import { reactive } from 'vue';

export const cart = reactive({
  items: [],

  // Add item to cart
  addItem(product) {
    // Use only id
    const existing = this.items.find(item => item.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
  },

  // Remove item from cart
  removeItem(id) {
    this.items = this.items.filter(item => item.id !== id);
  },

  // Clear the entire cart
  clearCart() {
    this.items = [];
  },

  // Load cart (in-memory, no backend)
  loadCart() {
    return this.items;
  }
});
