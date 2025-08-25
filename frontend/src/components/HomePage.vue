<template>
  <div class="home text-center text-light min-vh-100 d-flex flex-column justify-content-center align-items-center">
    <!-- Hero Section -->
    <div class="hero-content">
      <h1 class="fade-in-drop display-3 fw-bold">Welcome to <span class="text-warning">E-Shop</span> 🛒</h1>
      <p class="fade-in-rise lead">Your one-stop destination for the latest and coolest gadgets.</p>

      <div class="mt-4">
        <router-link to="/products">
          <button class="btn btn-lg btn-primary m-2 shadow">Browse Products</button>
        </router-link>
        <router-link to="/cart">
          <button class="btn btn-lg btn-success m-2 shadow">View Cart</button>
        </router-link>
        <button class="btn btn-lg btn-danger m-2 shadow" @click="handleLogout">Logout</button>
      </div>
    </div>

    <!-- Features Section -->
    <div class="features container mt-5">
      <div class="row text-dark">
        <div class="col-md-4 mb-3">
          <div class="card shadow-lg border-0 rounded-4 p-4 hover-card">
            <h4>⚡ Fast Delivery</h4>
            <p>Get your gadgets delivered to your doorstep at lightning speed.</p>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="card shadow-lg border-0 rounded-4 p-4 hover-card">
            <h4>💎 Premium Quality</h4>
            <p>Only the best, most reliable, and durable products for you.</p>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="card shadow-lg border-0 rounded-4 p-4 hover-card">
            <h4>🔒 Secure Payment</h4>
            <p>Safe, trusted, and hassle-free transactions every time.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  mounted() {
    // Prevent accessing without login
    if (!localStorage.getItem('isLoggedIn')) {
      this.$router.push('/');
    }
  },
  methods: {
    handleLogout() {
      // Clear login data
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userName');
      
      // Redirect to login
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.home {
  background: linear-gradient(135deg, #22374d, #1a252f);
}

.fade-in-drop {
  animation: drop 1s ease-in-out;
}
.fade-in-rise {
  animation: rise 1.5s ease-in-out;
}

@keyframes drop {
  from { opacity: 0; transform: translateY(-50px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes rise {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}

.hover-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.hover-card:hover {
  transform: translateY(-10px);
  box-shadow: 0px 8px 20px rgba(0,0,0,0.2);
}
</style>