<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark" :style="{ backgroundColor: '#22374d' }">
      <div class="container-fluid">
        <router-link class="navbar-brand fw-bold text-white" to="/">E-Shop</router-link>

        <div class="collapse navbar-collapse justify-content-between">
          <!-- Left Side Nav Links -->
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/home">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/products">Products</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/cart">Cart</router-link>
            </li>
          </ul>

          <!-- Right Side Auth Links -->
          <ul class="navbar-nav mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/signup">Signup</router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="logout">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Fixed transition with router-view slot -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
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
