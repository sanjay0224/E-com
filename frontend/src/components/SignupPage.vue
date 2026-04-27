<template>
  <div class="signup-container d-flex align-items-center justify-content-center min-vh-100 position-relative">
    <div class="glow-effect top-glow"></div>
    <div class="glow-effect bottom-glow"></div>

    <div class="container z-1 py-5">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-5 col-xl-4 mx-auto">
          <div class="glass-card shadow-lg p-5">
            <!-- Header -->
            <div class="text-center mb-4 pb-2">
              <div class="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 logo-circle shadow-lg">
                <i class="bi bi-person-plus fs-1 text-primary"></i>
              </div>
              <h3 class="fw-bold brand-font text-white">Create Account</h3>
              <p class="text-muted small">Join the next generation of E-Shop</p>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSignup">
              <!-- Name -->
              <div class="mb-4 position-relative">
                <label class="form-label text-muted small fw-semibold text-uppercase letter-spacing-1">Full Name</label>
                <div class="input-group-modern">
                  <i class="bi bi-person input-icon"></i>
                  <input type="text" v-model="name" class="form-control modern-input" placeholder="John Doe" required>
                </div>
              </div>

              <!-- Email -->
              <div class="mb-4 position-relative">
                <label class="form-label text-muted small fw-semibold text-uppercase letter-spacing-1">Email Address</label>
                <div class="input-group-modern">
                  <i class="bi bi-envelope input-icon"></i>
                  <input type="email" v-model="email" class="form-control modern-input" placeholder="name@example.com" required>
                </div>
              </div>

              <!-- Password -->
              <div class="mb-4 position-relative">
                <label class="form-label text-muted small fw-semibold text-uppercase letter-spacing-1">Password</label>
                <div class="input-group-modern">
                  <i class="bi bi-lock input-icon"></i>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    v-model="password"
                    class="form-control modern-input pe-5"
                    placeholder="Create a strong password"
                    required
                    @input="checkPasswordStrength"
                  >
                  <i
                    class="bi password-toggle"
                    :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"
                    @click="showPassword = !showPassword"
                  ></i>
                </div>

                <!-- Password Strength -->
                <div class="password-strength mt-3">
                  <div class="strength-bar" :class="passwordStrengthClass"></div>
                </div>
                <small class="text-muted d-block mt-2" style="font-size: 0.75rem;">
                  <i class="bi bi-info-circle fw-bold brand-font text-gradient me-1"></i> Use 8+ chars with upper, number & symbol
                </small>
              </div>

              <!-- Signup Button -->
              <button type="submit" class="btn-modern w-100 py-3 d-flex justify-content-center align-items-center gap-2 mt-2">
                Create Account <i class="bi bi-arrow-right"></i>
              </button>
            </form>

            <div class="divider text-muted small text-center position-relative my-4">
              <span class="bg-glass px-3 position-relative z-1">Or</span>
            </div>

            <!-- Login Redirect -->
            <div class="text-center mt-3">
              <p class="text-muted small mb-0">Already have an account?
                <router-link to="/login" class="text-primary fw-bold brand-font text-gradient ms-1">Sign in here</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      showPassword: false,
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
      if (!this.password) return '';
      let strength = 0;
      if (this.hasMinLength) strength++;
      if (this.hasUpperCase) strength++;
      if (this.hasNumber) strength++;
      if (this.hasSpecialChar) strength++;

      if (strength < 2) return 'weak';
      if (strength < 4) return 'medium';
      return 'strong';
    }
  },
  methods: {
    checkPasswordStrength() {
      // computed property handles this automatically
    },
    async handleSignup() {
      try {
        const response = await axios.post("/auth/signup", {
          name: this.name,
          email: this.email,
          password: this.password
        });

        // Better to use a UI toast in the future instead of alert
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
/* Layout */
.signup-container {
  background: radial-gradient(circle at bottom right, #1a1c20, #020617);
  overflow-x: hidden;
}

/* Glow Effects */
.glow-effect {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  z-index: 0;
  pointer-events: none;
}
.top-glow {
  top: -200px;
  right: -100px;
  background: radial-gradient(circle, rgba(249, 115, 22, 0.12) 0%, rgba(0,0,0,0) 70%);
}
.bottom-glow {
  bottom: -200px;
  left: -100px;
  background: radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, rgba(0,0,0,0) 70%);
}

.logo-circle {
  width: 70px;
  height: 70px;
  background: rgba(34, 37, 43, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  color: #64748b;
  z-index: 10;
}

.modern-input {
  background: rgba(26, 28, 32, 0.6) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: white !important;
  padding-left: 45px !important;
  height: 52px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.modern-input:focus {
  border-color: var(--primary) !important;
  box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.15) !important;
  background: rgba(26, 28, 32, 0.8) !important;
}

.password-toggle {
  position: absolute;
  right: 16px;
  color: #64748b;
  cursor: pointer;
  z-index: 10;
  transition: color 0.2s;
}

.password-toggle:hover {
  color: white;
}

/* Password strength bar */
.password-strength {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.strength-bar {
  height: 100%;
  width: 0%;
  transition: all 0.4s ease;
}

.strength-bar.weak {
  width: 33%;
  background: #f43f5e;
  box-shadow: 0 0 8px #f43f5e;
}

.strength-bar.medium {
  width: 66%;
  background: #f59e0b;
  box-shadow: 0 0 8px #f59e0b;
}

.strength-bar.strong {
  width: 100%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}

/* Divider */
.divider::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.bg-glass {
  background: #1a1c20;
}
</style>
