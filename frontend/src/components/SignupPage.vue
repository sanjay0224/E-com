<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="signup-container p-4 rounded shadow-lg bg-light">
          <!-- Header -->
          <div class="text-center mb-4">
            <h2><i class="fas fa-user-plus me-2"></i>Signup</h2>
            <p class="mb-0">Join our community today!</p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSignup">
            <!-- Name -->
            <div class="mb-3 position-relative">
              <label class="form-label">Name</label>
              <input type="text" v-model="name" class="form-control" placeholder="Enter name" required>
              <span class="input-icon"><i class="fas fa-user"></i></span>
            </div>

            <!-- Email -->
            <div class="mb-3 position-relative">
              <label class="form-label">Email</label>
              <input type="email" v-model="email" class="form-control" placeholder="Enter email" required>
              <span class="input-icon"><i class="fas fa-envelope"></i></span>
            </div>

            <!-- Password -->
            <div class="mb-3 position-relative">
              <label class="form-label">Password</label>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                class="form-control"
                placeholder="Create password"
                required
                @input="checkPasswordStrength"
              >
              <span class="input-icon" @click="showPassword = !showPassword" style="cursor: pointer;">
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </span>

              <!-- Password Strength -->
              <div class="password-strength mt-2" :class="passwordStrengthClass"></div>
              <small class="text-muted">Use at least 8 chars, with upper, number & special char</small>
            </div>

            <!-- Signup Button -->
            <button type="submit" class="btn btn-success w-100 mt-3">
              Signup <i class="fas fa-check ms-2"></i>
            </button>
          </form>

          <!-- Login Redirect -->
          <div class="text-center mt-3">
            <p class="mb-0">Already have an account?
              <router-link to="/login" class="text-primary fw-bold text-decoration-none">Login here</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      showPassword: false,
      passwordStrength: 0
    }
  },
  computed: {
    hasMinLength() {
      return this.password.length >= 8;
    },
    hasUpperCase() {
      return /[A-Z]/.test(this.password);
    },
    hasNumber() {
      return /[0-9]/.test(this.password);
    },
    hasSpecialChar() {
      return /[^A-Za-z0-9]/.test(this.password);
    },
    passwordStrengthClass() {
      let strength = 0;
      if (this.hasMinLength) strength++;
      if (this.hasUpperCase) strength++;
      if (this.hasNumber) strength++;
      if (this.hasSpecialChar) strength++;
      if (strength < 2) return 'strength-weak';
      if (strength < 4) return 'strength-medium';
      return 'strength-strong';
    }
  },
  methods: {
    async handleSignup() {
      try {
        const response = await axios.post("http://localhost:5000/api/auth/signup", {
          name: this.name,
          email: this.email,
          password: this.password
        });

        alert(response.data.message);
        this.$router.push('/login');
      } catch (err) {
        alert(err.response?.data?.message || 'Signup failed');
      }
    }
  }
};
</script>

<style scoped>
.signup-container {
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  color: black;
  height: auto;
}

a[routerLink] {
  text-decoration: none;
}

.router-link {
  text-decoration: none;
}
.input-icon {
  position: absolute;
  right: 15px;
  top: 38px;
  color: #858796;
}

.password-strength {
  height: 5px;
  background-color: transparent;
}

.strength-weak {
  width: 25%;
  background-color: #e74a3b;
}
.strength-medium.password-strength.weak { background-color: red; }
.password-strength.medium { background-color: orange; }
.password-strength.strong { background-color: green; }
</style>
