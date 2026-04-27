import { createRouter, createWebHashHistory } from 'vue-router';

import SignupPage from '@/components/SignupPage.vue';
import LoginPage from '@/components/LoginPage.vue';
import HomePage from '@/components/HomePage.vue';
import ProductPage from '@/components/ProductPage.vue';
import CartPage from '@/components/CartPage.vue';
import PaymentPage from '@/components/PaymentPage.vue';
import about from '@/components/about.vue';


const routes = [
  { path: '/', redirect: '/signup' },
  { path: '/signup', component: SignupPage },
  { path: '/login', component: LoginPage },
  { path: '/home', component: HomePage },
  { path: '/products', component: ProductPage },
  { path: '/cart', component: CartPage },
  { path: '/payment', component: PaymentPage },
  { path: '/:pathMatch(.*)*', redirect: '/signup' } ,
  {path: '/about', component: about}// catch-all
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 🔒 Route Guard
router.beforeEach((to, from, next) => {
  const publicPages = ['/signup', '/login'];
  const authRequired = !publicPages.includes(to.path);
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (authRequired && !isLoggedIn) {
    next('/signup'); // 🚫 Block access, redirect to signup
  } else {
    next(); // ✅ Allow access
  }
});

export default router;
