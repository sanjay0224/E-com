<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark" :style="{ backgroundColor: '#22374d' }">
      <div class="container-fluid">
        <router-link class="navbar-brand fw-bold text-white" to="/">E-Shop</router-link>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/products">Products</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/cart">Cart</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
/* Page transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Apply dark background and text color to all pages */
body,
html {
  background-color: #22374d;
  color: white;
  min-height: 100vh;
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
}

.navbar a.router-link-exact-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
