import { createRouter, createWebHashHistory } from 'vue-router'; // changed from createWebHistory
import HomePage from '../components/HomePage.vue';
import ProductPage from '../components/ProductPage.vue';
import CartPage from '../components/CartPage.vue';
import PaymentPage from '../components/PaymentPage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/products', component: ProductPage },
  { path: '/cart', component: CartPage },
  { path: '/payment', component: PaymentPage },
];

const router = createRouter({
  history: createWebHashHistory(), // changed this
  routes,
});

export default router;
