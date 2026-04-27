// src/store/cart.js
import { reactive } from 'vue';

export const cart = reactive({
  items: [],

  // Add item to cart
  addItem(product) {
    // Use _id from MongoDB
    const existing = this.items.find(item => item._id === product._id);
    if (existing) {
      existing.quantity++;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
  },

  // Remove item from cart
  removeItem(id) {
    this.items = this.items.filter(item => item._id !== id);
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
