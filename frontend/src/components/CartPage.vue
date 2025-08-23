<template>
  <div class="container mt-4 text-light">
    <h2 class="mb-4">Your Cart</h2>

    <div v-if="cartItems.length > 0">
      <table class="table table-dark table-bordered align-middle text-center">
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartItems" :key="item.id || item._id">
            <td>{{ item.name }}</td>
            <td>₹{{ item.price }}</td>
            <td>{{ item.quantity || 1 }}</td>
            <td>₹{{ item.price * (item.quantity || 1) }}</td>
            <td>
              <button class="btn btn-danger btn-sm" @click="removeItem(item.id || item._id)">
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="d-flex justify-content-end mb-3">
        <h4>Total: ₹{{ cartTotal }}</h4>
      </div>

      <div class="d-flex justify-content-end gap-2">
        <button class="btn btn-warning" @click="clearCart">Clear Cart</button>
        <router-link to="/payment" class="btn btn-success">
          Proceed to Payment
        </router-link>
      </div>
    </div>

    <div v-else class="text-center mt-5">
      <h4>Your cart is empty 🛍️</h4>
      <router-link to="/products" class="btn btn-primary mt-3">
        Browse Products
      </router-link>
    </div>
  </div>
</template>

<script>
import { onMounted, computed } from 'vue';
import { cart } from '../store/cart';

export default {
  name: 'CartPage',
  setup() {
    onMounted(() => {
      cart.loadCart(); // Load reactive in-memory cart
    });

    const cartItems = computed(() => cart.items);
    const cartTotal = computed(() =>
      cart.items.reduce((total, item) => total + item.price * (item.quantity || 1), 0)
    );

    const removeItem = (id) => {
      cart.removeItem(id);
    };

    const clearCart = () => {
      cart.clearCart();
    };

    return { cartItems, cartTotal, removeItem, clearCart };
  }
};
</script>

<style scoped>
h2 {
  font-weight: bold;
}
table {
  border-radius: 8px;
  overflow: hidden;
}
</style>
