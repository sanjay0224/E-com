<template>
  <div class="container mt-4 text-light">
    <h2 class="mb-4 text-center"> Your Shopping Cart</h2>

    <div v-if="cartItems.length > 0">
      <!-- Cart Table -->
      <table class="table table-dark table-hover table-bordered align-middle text-center shadow-lg">
        <thead class="table-secondary text-dark">
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <transition-group tag="tbody" name="fade">
          <tr v-for="item in cartItems" :key="item.id || item._id">
            <td>{{ item.name }}</td>
            <td>₹{{ item.price }}</td>
            <td>
              <div class="d-flex justify-content-center align-items-center gap-2">
                <button class="btn btn-sm btn-outline-light" @click="decreaseQty(item)">-</button>
                <span class="fw-bold">{{ item.quantity || 1 }}</span>
                <button class="btn btn-sm btn-outline-light" @click="increaseQty(item)">+</button>
              </div>
            </td>
            <td>₹{{ item.price * (item.quantity || 1) }}</td>
            <td>
              <button class="btn btn-danger btn-sm" @click="removeItem(item.id || item._id)">
                Remove
              </button>
            </td>
          </tr>
        </transition-group>
      </table>

      <!-- Cart Summary -->
      <div class="card bg-dark text-light p-3 mt-3 shadow-lg">
        <h4 class="mb-3">Order Summary</h4>
        <div class="d-flex justify-content-between">
          <span>Subtotal:</span>
          <span>₹{{ cartSubtotal }}</span>
        </div>
        <div class="d-flex justify-content-between">
          <span>Tax (5%):</span>
          <span>₹{{ taxAmount }}</span>
        </div>
        <div class="d-flex justify-content-between fw-bold border-top pt-2">
          <span>Total:</span>
          <span>₹{{ cartTotal }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="d-flex justify-content-end gap-2 mt-3">
        <button class="btn btn-warning" @click="clearCart">Clear Cart</button>
        <router-link to="/payment" class="btn btn-success">
          Proceed to Payment 💳
        </router-link>
      </div>
    </div>

    <!-- Empty Cart -->
    <div v-else class="text-center mt-5">
      <img
        src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
        alt="Empty Cart"
        width="120"
        class="mb-3"
      />
      <h4>Your cart is empty </h4>
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
      cart.loadCart();
    });

    const cartItems = computed(() => cart.items);

    const cartSubtotal = computed(() =>
      cart.items.reduce((total, item) => total + item.price * (item.quantity || 1), 0)
    );

    const taxAmount = computed(() => (cartSubtotal.value * 0.05).toFixed(2));

    const cartTotal = computed(() => (cartSubtotal.value + parseFloat(taxAmount.value)).toFixed(2));

    const removeItem = (id) => {
      cart.removeItem(id);
    };

    const clearCart = () => {
      cart.clearCart();
    };

    const increaseQty = (item) => {
      item.quantity = (item.quantity || 1) + 1;
    };

    const decreaseQty = (item) => {
      if (item.quantity > 1) item.quantity--;
    };

    return {
      cartItems,
      cartSubtotal,
      taxAmount,
      cartTotal,
      removeItem,
      clearCart,
      increaseQty,
      decreaseQty
    };
  }
};
</script>

<style scoped>
h2 {
  font-weight: bold;
}

table {
  border-radius: 10px;
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
