<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">Login</h2>
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <form class="bg-light text-dark p-4 rounded shadow-sm">
          <div class="mb-3">
            <label>Email</label>
            <input
              type="email"
              v-model="email"
              class="form-control"
              placeholder="Enter email"
              required
            />
          </div>
          <div class="mb-3">
            <label>Password</label>
            <input
              type="password"
              v-model="password"
              class="form-control"
              placeholder="Enter password"
              required
            />
          </div>

          <!-- Actual visible button -->
          <button
            type="button"
            @click="handleLogin"
            class="btn btn-success w-100 fw-bold"
            style=" border:none; padding:10px; border-radius:8px;"
          >
            Login
          </button>

          <!-- Extra: Forgot password + Signup link -->
          <div class="d-flex justify-content-between mt-3">
            <a href="#" class="text-decoration-none text-primary small">Forgot password?</a>
            <a href="/signup" class="text-decoration-none text-success small">New user? Signup</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
   async handleLogin() {
  try {
    const response = await axios.post("http://localhost:5000/api/auth/login", {
  email: this.email,
  password: this.password
});

    alert(response.data.message);

    // ✅ Store login status and token
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("userName", response.data.user.name);

    // ✅ Redirect to home
    this.$router.push("/home");
  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  }
}


  }
};
</script>
<style>
/* subtle card hover */
form {
  transition: transform 0.2s ease-in-out;
}
form:hover {
  transform: translateY(-3px);
}
</style>