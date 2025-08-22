<template>
  <div class="container mt-4 text-light">
    <h2 class="mb-4"> Your Cart</h2>

    <table class="table table-dark table-bordered">
      <thead>
        <tr>
          <th>Item</th>
          <th>Price</th>
          <th>Qty</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in cartItems" :key="item.id">
          <td>{{ item.name }}</td>
          <td>₹{{ item.price }}</td>
          <td>{{ item.quantity }}</td>
          <td>₹{{ item.price * item.quantity }}</td>
        </tr>
      </tbody>
    </table>

    <div class="d-flex justify-content-end mb-3">
      <h4>Total: ₹{{ cartTotal }}</h4>
    </div>

    <router-link to="/payment" class="btn btn-success">Proceed to Payment</router-link>
  </div>
</template>

<script>
import { cart } from '../store/cart';

export default {
  name: 'CartPage',
  computed: {
    cartItems() {
      return cart.items;
    },
    cartTotal() {
      return cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    }
  }
};
</script>
