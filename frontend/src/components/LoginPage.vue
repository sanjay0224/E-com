<template>
  <div class="login-container d-flex align-items-center justify-content-center min-vh-100 position-relative">
    <div class="glow-effect top-glow"></div>
    <div class="glow-effect bottom-glow"></div>

    <div class="container z-1">
      <div class="row w-100 mx-auto justify-content-center align-items-center">
        <!-- Left Side with Banner -->
        <div class="col-md-6 d-none d-md-flex flex-column justify-content-center p-5 text-white pe-lg-5">
          <h2 class="display-4 fw-bold brand-font text-gradient mb-4">Welcome Back!</h2>
          <p class="fs-5 text-muted mb-5 max-w-md">Login to continue shopping the best next-gen deals on E-Shop today.</p>
          
          <div class="glass-card p-4 border-primary-glow d-flex align-items-center gap-4 mt-3">
            <div class="icon-circle bg-primary-subtle text-primary">
              <i class="bi bi-shield-check fs-2"></i>
            </div>
            <div>
              <h5 class="fw-bold mb-1">Secure Login</h5>
              <p class="text-muted small mb-0">Your data is encrypted using next-gen security protocols.</p>
            </div>
          </div>
        </div>

        <!-- Right Side with Form -->
        <div class="col-md-6 col-lg-5 col-xl-4 mx-auto ps-lg-4">
          <div class="glass-card shadow-lg p-5">
            <div class="text-center mb-4 pb-2">
              <div class="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 logo-circle shadow-lg">
                <i class="bi bi-box-seam fs-1 text-primary"></i>
              </div>
              <h3 class="fw-bold brand-font text-white">Sign In</h3>
              <p class=" fw-bold ">Access your E-Shop account</p>
            </div>

            <!-- Alerts -->
            <div v-if="error" class="alert alert-danger bg-danger bg-opacity-10 border-danger text-danger p-3 rounded-3 small animate-fade">{{ error }}</div>
            <div v-if="success" class="alert alert-success bg-success bg-opacity-10 border-success text-success p-3 rounded-3 small animate-fade">{{ success }}</div>

            <form @submit.prevent="handleLogin" class="mt-4">
              <div class="mb-4 position-relative">
                <label class="form-label text-muted small fw-semibold text-uppercase letter-spacing-1">Email Address</label>
                <div class="input-group-modern">
                  <i class="bi bi-envelope input-icon"></i>
                  <input
                    type="email"
                    v-model="email"
                    class="form-control modern-input"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div class="mb-4 position-relative">
                <div class="d-flex justify-content-between align-items-center">
                  <label class="form-label text-muted small fw-semibold text-uppercase letter-spacing-1">Password</label>
                  <a href="#" class="text-primary small fw-bold brand-font text-gradient mb-2">Forgot?</a>
                </div>
                <div class="input-group-modern">
                  <i class="bi bi-lock input-icon"></i>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    v-model="password"
                    class="form-control modern-input pe-5"
                    placeholder="Enter your password"
                    required
                  />
                  <i
                    class="bi password-toggle"
                    :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"
                    @click="showPassword = !showPassword"
                  ></i>
                </div>
              </div>

              <div class="d-flex align-items-center mb-4">
                <div class="custom-checkbox">
                  <input type="checkbox" id="remember" class="custom-control-input" />
                  <label class="custom-control-label ms-2 text-muted small" for="remember">Remember me for 30 days</label>
                </div>
              </div>

              <button type="submit" class="btn-modern w-100 py-3 d-flex justify-content-center align-items-center gap-2 mb-4 text-dark">
                Sign In <i class="bi bi-arrow-right"></i>
              </button>

              <div class="divider text-muted small text-center position-relative my-4">
                <span class="bg-glass px-3 position-relative z-1">Or continue with</span>
              </div>

              <!-- Social login -->
              <div class="d-flex gap-3 mt-3 mb-4">
                <button type="button" class="btn-outline-modern flex-grow-1 py-2 text-dark">
                  <i class="bi bi-google text-danger me-2"></i> Google
                </button>
                <button type="button" class="btn-outline-modern flex-grow-1 py-2 text-dark">
                  <i class="bi bi-facebook text-primary me-2"></i> Facebook
                </button>
</div>

              <div class="text-center mt-4 pt-2">
                <p class="text-muted small mb-0">
                  Don't have an account? 
                  <router-link to="/signup" class="text-primary fw-bold brand-font text-gradient ms-1">Sign up now</router-link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/axios";

export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      error: null,
      success: null
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post(
          "/auth/login",
          {
            email: this.email,
            password: this.password,
          }
        );

        this.success = response.data.message;
        this.error = null;

        // ✅ Store login status
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userName", response.data.user.name);

        setTimeout(() => {
          this.$router.push("/home");
        }, 1000);
      } catch (err) {
        this.error = err.response?.data?.message || "Login failed";
        this.success = null;
      }
    },
  },
};
</script>

<style scoped>
/* Layout */
.login-container {
  background: radial-gradient(circle at bottom right, #1a1c20, #020617);
  overflow-x: hidden;
}

.max-w-md {
  max-width: 28rem;
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
  left: -100px;
  background: radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, rgba(0,0,0,0) 70%);
}
.bottom-glow {
  bottom: -200px;
  right: -100px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, rgba(0,0,0,0) 70%);
}

.border-primary-glow {
  border: 1px solid rgba(249, 115, 22, 0.3);
  background: rgba(26, 28, 32, 0.4);
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

.custom-checkbox {
  display: flex;
  align-items: center;
}

.custom-control-input {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
  background-color: transparent;
  cursor: pointer;
}

.custom-control-label {
  cursor: pointer;
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

.animate-fade {
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
