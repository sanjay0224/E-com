<template>
  <nav class="navbar navbar-expand-lg navbar-dark" :style="{ backgroundColor: '#22374d' }">
    <div class="container-fluid">
      <!-- Brand -->
      <router-link class="navbar-brand fw-bold text-white" to="/">E-Shop</router-link>

      <!-- Toggler -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navbar Content -->
      <div class="collapse navbar-collapse justify-content-between" id="navbarContent">
        
        <!-- Left Nav -->
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/home" active-class="active fw-bold text-warning">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/products" active-class="active fw-bold text-warning">Products</router-link>
          </li>
        </ul>

        <!-- Search -->
        

        <!-- Right Nav -->
        <ul class="navbar-nav mb-2 mb-lg-0">
          <!-- Cart -->
          <li class="nav-item position-relative">
            <router-link class="nav-link" to="/cart">
              <i class="bi bi-cart3"></i> Cart
              <span 
                v-if="cartCount > 0" 
                class="badge bg-danger position-absolute top-0 start-100 translate-middle"
              >
                {{ cartCount }}
              </span>
            </router-link>
          </li>

           <!-- Account Dropdown -->
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-person-circle"></i> Account
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <!-- Not Logged In -->
              <li v-if="!isLoggedIn">
                <router-link class="dropdown-item" to="/login">Login</router-link>
              </li>
              <li v-if="!isLoggedIn">
                <router-link class="dropdown-item" to="/signup">Signup</router-link>
              </li>

              <!-- Logged In -->
              <li v-if="isLoggedIn"></li>
              <li v-if="isLoggedIn">
                <router-link class="dropdown-item" to="/account">My Account</router-link>
              </li>
              <li v-if="isLoggedIn">
                <a class="dropdown-item" href="#" @click.prevent="logout">Logout</a>
              </li>
              <!--about us-->
              <li>
                <router-link class="dropdown-item" to="/about">About us</router-link>
              </li>
            </ul>
          </li>
        </ul>

      </div>
    </div>
  </nav>
</template>



<script>
import { cart } from "@/store/cart"; // import your cart store
import { computed } from "vue";
export default {
  name: "AppNavbar",
  setup() {
    // compute total count of cart items
    const cartCount = computed(() =>
      cart.items.reduce((total, item) => total + item.quantity, 0)
    );

    return { cart, cartCount };
  },
  data() {
    return {
      isLoggedIn: !!localStorage.getItem("token"), // check if token exists
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.isLoggedIn = false;
      console.log("User logged out!");
      this.$router.push("/login");
    },
  },
};

</script>
