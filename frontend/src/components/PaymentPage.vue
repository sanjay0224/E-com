<template>
  <div class="payment-page min-vh-100 py-5 position-relative">
    <div class="glow-effect top-glow"></div>

    <div class="container position-relative z-1">
      <div class="row justify-content-center">
        <div class="col-lg-7">
          <h2 class="display-5 fw-bold brand-font text-gradient text-center mb-5">💳 Checkout</h2>
          <p class="text-muted text-center mb-5">Review your order and fill in your details to complete the purchase.</p>

          <div v-if="!paymentSuccess">
            <!-- Order Summary -->
            <div class="glass-card p-4 mb-4">
              <h4 class="brand-font fw-bold text-white mb-4"><i class="bi bi-bag-check me-2"></i>Order Summary</h4>
              <div class="order-items mb-3">
                <div
                  v-for="item in cart.items"
                  :key="item.id || item._id"
                  class="d-flex justify-content-between align-items-center order-row py-3"
                >
                  <div>
                    <span class="fw-bold text-white">{{ item.name }}</span>
                    <small class="text-muted d-block">Qty: {{ item.quantity }}</small>
                  </div>
                  <span class="fs-5 fw-bold text-white">₹{{ item.price * item.quantity }}</span>
                </div>
              </div>
              <div class="divider mb-3"></div>
              <div class="d-flex justify-content-between fw-bold fs-4 brand-font">
                <span class="text-muted">Total</span>
                <span class="text-gradient">₹{{ cartTotal }}</span>
              </div>
            </div>

            <!-- Payment Form -->
            <div class="glass-card p-5">
              <h4 class="brand-font fw-bold text-white mb-4"><i class="bi bi-person-lines-fill me-2"></i>Your Details</h4>
              <form @submit.prevent="submitPayment">
                <!-- Name -->
                <div class="mb-4 position-relative">
                  <label for="name" class="form-label text-muted small fw-semibold text-uppercase letter-spacing-1">Full Name</label>
                  <div class="input-group-modern">
                    <i class="bi bi-person input-icon"></i>
                    <input type="text" v-model="form.name" class="form-control modern-input" id="name" placeholder="John Doe" required />
                  </div>
                </div>

                <!-- Email -->
                <div class="mb-4 position-relative">
                  <label for="email" class="form-label text-muted small fw-semibold text-uppercase letter-spacing-1">Email Address</label>
                  <div class="input-group-modern">
                    <i class="bi bi-envelope input-icon"></i>
                    <input type="email" v-model="form.email" class="form-control modern-input" id="email" placeholder="name@example.com" required />
                  </div>
                </div>

                <!-- Address -->
                <div class="mb-4 position-relative">
                  <label for="address" class="form-label text-muted small fw-semibold text-uppercase letter-spacing-1">Shipping Address</label>
                  <div class="input-group-modern">
                    <i class="bi bi-geo-alt input-icon" style="top: 18px; transform: none;"></i>
                    <textarea v-model="form.address" class="form-control modern-input pt-3" id="address" rows="3" placeholder="Enter your shipping address" required style="padding-left: 45px; height: auto;"></textarea>
                  </div>
                </div>

                <!-- Payment Method -->
                <div class="mb-5">
                  <label class="form-label text-muted small fw-semibold text-uppercase letter-spacing-1 mb-3">Payment Method</label>
                  <div class="row g-3">
                    <div class="col-4" v-for="method in paymentMethods" :key="method.value">
                      <label
                        class="payment-option"
                        :class="{ active: form.paymentMethod === method.value }"
                      >
                        <input class="d-none" type="radio" :value="method.value" v-model="form.paymentMethod" required />
                        <i :class="method.icon" class="fs-4 mb-2 d-block"></i>
                        <span class="small fw-semibold">{{ method.label }}</span>
                      </label>
                    </div>
                  </div>
                </div>

                <button type="submit" class="btn-modern w-100 py-3 d-flex justify-content-center align-items-center gap-2 fs-5">
                  <i class="bi bi-lock me-1"></i> Pay ₹{{ cartTotal }} Securely
                </button>
              </form>
            </div>
          </div>

          <!-- Success Message -->
          <div v-if="paymentSuccess" class="glass-card p-4 mt-4 text-center border-success-glow animate-in">
            <i class="bi bi-check-circle display-4 text-success mb-3 d-block"></i>
            <h4 class="brand-font fw-bold text-white mb-2">Payment Successful!</h4>
            <p class="text-muted">Your order has been placed. It will be delivered to you soon.</p>
            <router-link to="/home" class="btn-modern px-5 py-2 mt-2 d-inline-block">Back to Home</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { cart } from "../store/cart"; // import reactive cart
import axios from "@/axios"; // your axios instance

export default {
  name: "PaymentPage",
  data() {
    return {
      form: {
        name: "",
        email: "",
        address: "",
        paymentMethod: "",
      },
      paymentSuccess: false,
      cart,
      paymentMethods: [
        { value: "Credit Card", label: "Credit Card", icon: "bi bi-credit-card" },
        { value: "UPI", label: "UPI", icon: "bi bi-phone" },
        { value: "Cash on Delivery", label: "Cash on Delivery", icon: "bi bi-cash-coin" },
      ],
    };
  },
  computed: {
    cartTotal() {
      return this.cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },
  },
  methods: {
    async submitPayment() {
      if (!this.form.address || !this.form.paymentMethod) {
        alert("Please fill all required fields");
        return;
      }

      try {
        const userId = "64f1a3c0a1b2c3d4e5f67890";

        const orderData = {
          userId,
          items: this.cart.items.map(item => ({
            productId: item.id || item._id, // map from id or _id
            name: item.name,
            quantity: item.quantity
          })),
          totalAmount: this.cartTotal,
          address: this.form.address
        };

        const res = await axios.post("/orders", orderData);

        if (res.data.success) {
          this.paymentSuccess = true;
          console.log("✅ Order stored in DB:", res.data.order);
          this.cart.items = [];
        }
      } catch (err) {
        console.error("❌ Payment/Order failed:", err.response?.data || err);
        alert("Something went wrong, check console for details");
      }
    }
  }
};
</script>

<style scoped>
.payment-page {
  overflow-x: hidden;
}

/* Glow */
.glow-effect {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}
.top-glow {
  top: -150px;
  right: -100px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(0,0,0,0) 70%);
}

/* Order Items */
.order-row {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.order-row:last-child {
  border-bottom: none;
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%);
}

/* Forms */
.letter-spacing-1 {
  letter-spacing: 1px;
}

.input-group-modern {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  z-index: 10;
}

.modern-input {
  background: rgba(15, 23, 42, 0.6) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: white !important;
  padding-left: 45px !important;
  height: 52px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.modern-input:focus {
  border-color: var(--primary) !important;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15) !important;
  background: rgba(15, 23, 42, 0.8) !important;
}

/* Payment Options */
.payment-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  color: var(--text-muted);
  text-align: center;
  transition: all 0.3s ease;
  min-height: 90px;
}
.payment-option:hover {
  border-color: var(--primary);
  color: white;
}
.payment-option.active {
  border-color: var(--primary);
  background: rgba(99, 102, 241, 0.15);
  color: white;
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.2);
}

/* Success */
.border-success-glow {
  border-color: rgba(16, 185, 129, 0.4) !important;
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.1);
}
.animate-in {
  animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
