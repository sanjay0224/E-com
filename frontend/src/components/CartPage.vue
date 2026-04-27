<template>
  <div class="cart-page">
    <div class="container py-5">

      <!-- Header -->
      <div class="page-header mb-5">
        <h1 class="section-title">Shopping Cart</h1>
        <p class="section-subtitle" v-if="cart.items.length">{{ cart.items.length }} item{{ cart.items.length > 1 ? 's' : '' }} in your cart</p>
      </div>

      <!-- Steps -->
      <div class="checkout-steps mb-5">
        <div class="step active"><div class="step-num">1</div><span>Cart</span></div>
        <div class="step-line"></div>
        <div class="step"><div class="step-num">2</div><span>Payment</span></div>
        <div class="step-line"></div>
        <div class="step"><div class="step-num">3</div><span>Confirm</span></div>
      </div>

      <!-- Empty State -->
      <div v-if="cart.items.length === 0" class="empty-cart glass-card">
        <i class="bi bi-bag-x empty-icon"></i>
        <h3>Your cart is empty</h3>
        <p>Add some products to get started!</p>
        <router-link to="/products" class="btn-primary-cta">Browse Products</router-link>
      </div>

      <!-- Cart Layout -->
      <div v-else class="cart-layout">
        <!-- Items -->
        <div class="cart-items">
          <div class="cart-item glass-card" v-for="item in cart.items" :key="item._id">
            <div class="item-img-wrap">
              <img :src="item.image" :alt="item.name" class="item-img" />
            </div>
            <div class="item-details">
              <div class="item-cat">{{ item.category }}</div>
              <div class="item-name">{{ item.name }}</div>
              <div class="item-stars">
                <i v-for="s in 5" :key="s" class="bi" :class="s <= (item.rating||4) ? 'bi-star-fill star-filled' : 'bi-star star-empty'"></i>
              </div>
              <div class="item-unit-price">₹{{ item.price.toLocaleString() }} / unit</div>
            </div>
            <div class="item-controls">
              <div class="qty-control">
                <button class="qty-btn" @click="decreaseQty(item)" :disabled="item.quantity <= 1">
                  <i class="bi bi-dash"></i>
                </button>
                <span class="qty-val">{{ item.quantity }}</span>
                <button class="qty-btn" @click="increaseQty(item)">
                  <i class="bi bi-plus"></i>
                </button>
              </div>
              <div class="item-subtotal">₹{{ (item.price * item.quantity).toLocaleString() }}</div>
              <button class="remove-btn" @click="removeItem(item._id)" title="Remove">
                <i class="bi bi-trash3"></i>
              </button>
            </div>
          </div>

          <!-- Clear Cart -->
          <div class="cart-footer-bar glass-card">
            <button class="btn-secondary-cta" @click="cart.clearCart()">
              <i class="bi bi-trash"></i> Clear Cart
            </button>
            <router-link to="/products" class="btn-secondary-cta">
              <i class="bi bi-arrow-left"></i> Continue Shopping
            </router-link>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="order-summary glass-card">
          <h4 class="summary-title"><i class="bi bi-receipt"></i> Order Summary</h4>

          <div class="summary-row" v-for="item in cart.items" :key="item._id + 'sum'">
            <span class="summary-item-name">{{ item.name }} × {{ item.quantity }}</span>
            <span>₹{{ (item.price * item.quantity).toLocaleString() }}</span>
          </div>

          <div class="divider-glass my-3"></div>

          <div class="summary-row">
            <span>Subtotal</span>
            <span>₹{{ cartSubtotal.toLocaleString() }}</span>
          </div>
          <div class="summary-row">
            <span>Delivery</span>
            <span :class="cartSubtotal >= 999 ? 'text-success-custom' : ''">
              {{ cartSubtotal >= 999 ? 'FREE' : '₹99' }}
            </span>
          </div>
          <div class="summary-row" v-if="totalSavings > 0">
            <span class="text-success-custom">You Save</span>
            <span class="text-success-custom">-₹{{ totalSavings.toLocaleString() }}</span>
          </div>

          <div class="divider-glass my-3"></div>

          <div class="summary-total">
            <span>Total</span>
            <span class="total-amount">₹{{ grandTotal.toLocaleString() }}</span>
          </div>

          <div v-if="cartSubtotal < 999" class="free-delivery-hint">
            Add ₹{{ (999 - cartSubtotal).toLocaleString() }} more for FREE delivery
            <div class="hint-bar"><div class="hint-fill" :style="{ width: (cartSubtotal/999*100) + '%' }"></div></div>
          </div>

          <router-link to="/payment" class="btn-primary-cta checkout-btn">
            <i class="bi bi-lock-fill"></i> Proceed to Payment
          </router-link>

          <div class="trust-row">
            <div class="trust-mini"><i class="bi bi-shield-check"></i> Secure Checkout</div>
            <div class="trust-mini"><i class="bi bi-arrow-counterclockwise"></i> Easy Returns</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { cart } from "../store/cart";

export default {
  name: "CartPage",
  data() { return { cart }; },
  computed: {
    cartSubtotal() {
      return this.cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
    },
    totalSavings() {
      return this.cart.items.reduce((s, i) => {
        const orig = i.originalPrice || i.price;
        return s + (orig - i.price) * i.quantity;
      }, 0);
    },
    deliveryFee() { return this.cartSubtotal >= 999 ? 0 : 99; },
    grandTotal() { return this.cartSubtotal + this.deliveryFee; },
  },
  methods: {
    increaseQty(item) { item.quantity++; },
    decreaseQty(item) { if (item.quantity > 1) item.quantity--; },
    removeItem(id) { cart.removeItem(id); },
  },
};
</script>

<style scoped>
.cart-page { min-height: 100vh; }
.container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
.page-header { border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 24px; }

/* Steps */
.checkout-steps {
  display: flex; align-items: center; justify-content: center; gap: 0;
  max-width: 400px; margin: 0 auto 40px;
}
.step { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.step-num {
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(255,255,255,0.05); border: 2px solid rgba(255,255,255,0.1);
  color: #64748b; font-weight: 700; font-size: 14px;
  display: flex; align-items: center; justify-content: center; transition: all 0.3s;
}
.step span { font-size: 12px; color: #64748b; font-weight: 600; }
.step.active .step-num { background: #f97316; border-color: #f97316; color: #fff; box-shadow: 0 0 15px rgba(249,115,22,0.32); }
.step.active span { color: #fb923c; }
.step-line { flex: 1; height: 2px; background: rgba(255,255,255,0.06); margin: 0 8px; margin-bottom: 20px; min-width: 60px; }

/* Empty */
.empty-cart { text-align: center; padding: 80px 40px; }
.empty-icon { font-size: 64px; color: #22252b; display: block; margin-bottom: 20px; }
.empty-cart h3 { color: #fff; margin-bottom: 10px; }
.empty-cart p { color: #64748b; margin-bottom: 24px; }

/* Layout */
.cart-layout { display: grid; grid-template-columns: 1fr 360px; gap: 24px; align-items: start; }
.cart-items { display: flex; flex-direction: column; gap: 14px; }

/* Item */
.cart-item { display: flex; align-items: center; gap: 16px; padding: 16px; }
.item-img-wrap { width: 90px; height: 90px; background: #fff; border-radius: 10px; overflow: hidden; flex-shrink: 0; }
.item-img { width: 100%; height: 100%; object-fit: contain; padding: 8px; }
.item-details { flex: 1; min-width: 0; }
.item-cat { color: #f97316; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
.item-name { color: #fff; font-weight: 600; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 5px; }
.item-stars { display: flex; gap: 2px; margin-bottom: 5px; }
.star-filled { color: #f59e0b; font-size: 11px; }
.star-empty { color: #334155; font-size: 11px; }
.item-unit-price { color: #64748b; font-size: 13px; }

.item-controls { display: flex; align-items: center; gap: 16px; flex-shrink: 0; }

.qty-control {
  display: flex; align-items: center; gap: 0;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px; overflow: hidden;
}
.qty-btn {
  width: 34px; height: 34px; background: none; border: none;
  color: #94a3b8; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all 0.2s; font-size: 14px;
}
.qty-btn:hover:not(:disabled) { background: rgba(249,115,22,0.12); color: #fb923c; }
.qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.qty-val { min-width: 32px; text-align: center; color: #fff; font-weight: 600; font-size: 14px; }

.item-subtotal { color: #fff; font-weight: 700; font-size: 17px; min-width: 80px; text-align: right; font-family: 'Plus Jakarta Sans', sans-serif; }

.remove-btn {
  width: 34px; height: 34px; border-radius: 8px;
  background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.15);
  color: #f87171; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all 0.2s; font-size: 14px;
}
.remove-btn:hover { background: rgba(239,68,68,0.2); color: #fca5a5; }

/* Footer bar */
.cart-footer-bar { display: flex; justify-content: space-between; padding: 14px 16px; }

/* Summary */
.order-summary { padding: 24px; position: sticky; top: 84px; }
.summary-title { color: #fff; font-size: 16px; font-weight: 700; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
.summary-row { display: flex; justify-content: space-between; color: #94a3b8; font-size: 14px; margin-bottom: 10px; }
.summary-item-name { color: #64748b; font-size: 13px; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.text-success-custom { color: #34d399 !important; font-weight: 600; }

.summary-total { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.summary-total span:first-child { color: #fff; font-weight: 600; font-size: 15px; }
.total-amount { color: #fff; font-size: 26px; font-weight: 800; font-family: 'Plus Jakarta Sans', sans-serif; }

.free-delivery-hint { background: rgba(249,115,22,0.07); border: 1px solid rgba(249,115,22,0.12); border-radius: 10px; padding: 12px; margin-bottom: 16px; color: #94a3b8; font-size: 13px; }
.hint-bar { background: rgba(255,255,255,0.08); border-radius: 100px; height: 4px; margin-top: 8px; overflow: hidden; }
.hint-fill { background: linear-gradient(90deg, #f97316, #f59e0b); height: 100%; border-radius: 100px; transition: width 0.4s ease; }

.checkout-btn { width: 100%; justify-content: center; margin-bottom: 14px; padding: 14px; font-size: 15px; }

.trust-row { display: flex; justify-content: center; gap: 20px; }
.trust-mini { color: #475569; font-size: 12px; display: flex; align-items: center; gap: 5px; }
.trust-mini i { color: #f97316; }

@media (max-width: 900px) {
  .cart-layout { grid-template-columns: 1fr; }
  .order-summary { position: static; }
}
@media (max-width: 600px) {
  .cart-item { flex-wrap: wrap; }
  .item-controls { width: 100%; justify-content: space-between; }
  .checkout-steps { max-width: 100%; }
}
</style>
