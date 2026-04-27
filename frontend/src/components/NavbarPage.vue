<template>
  <nav class="app-nav" :class="{ 'nav-scrolled': scrolled }">
    <div class="nav-container">
      <!-- Left Utility Links -->
      <div class="nav-utils left desktop-only">
        <router-link to="/products" class="util-link">Explore</router-link>
        <router-link to="/about" class="util-link">Help</router-link>
      </div>

      <!-- Brand -->
      <router-link class="nav-brand" to="/home">
        <span class="brand-name"><span class="brand-shop">Shop</span><span class="brand-vibe">Vibe</span></span>
      </router-link>

      <!-- Search Bar (desktop) -->
      <div class="nav-search-wrap desktop-only">
        <div class="nav-search">
          <i class="bi bi-search search-ico"></i>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search for mobiles, fashion, electronics..."
            class="search-field"
          />
          <button v-if="searchQuery" @click="searchQuery=''" class="search-clear">
            <i class="bi bi-x"></i>
          </button>
        </div>
      </div>

      <!-- Right Actions -->
      <div class="nav-actions">
        <!-- Right Utility Links -->
        <div class="nav-utils right desktop-only">
          <router-link to="/home" class="util-link">Home</router-link>
          <a href="#" class="util-link">Track Orders</a>
          <router-link v-if="!isLoggedIn" to="/signup" class="util-link join-btn">Join Free</router-link>
          <router-link v-else to="/cart" class="util-link">My Activity</router-link>
        </div>

        <!-- Cart -->
        <router-link to="/cart" class="nav-icon-btn" title="Cart">
          <i class="bi bi-bag"></i>
          <span v-if="cartCount > 0" class="nav-badge">{{ cartCount > 9 ? '9+' : cartCount }}</span>
        </router-link>

        <!-- Account Dropdown -->
        <div class="nav-account" v-click-outside="closeDropdown">
          <button class="nav-icon-btn account-btn" @click="toggleDropdown">
            <div class="avatar-mini">{{ userInitial }}</div>
          </button>
          <transition name="dropdown">
            <div v-if="dropdownOpen" class="account-dropdown">
              <div class="dropdown-header" v-if="isLoggedIn">
                <div class="dh-avatar">{{ userInitial }}</div>
                <div>
                  <div class="dh-name">{{ userName }}</div>
                  <div class="dh-label">Member</div>
                </div>
              </div>
              <div class="divider-glass" v-if="isLoggedIn" style="margin: 8px 0;"></div>
              <template v-if="!isLoggedIn">
                <router-link to="/login" class="dropdown-item-link" @click="closeDropdown">
                  <i class="bi bi-box-arrow-in-right"></i> Login
                </router-link>
                <router-link to="/signup" class="dropdown-item-link" @click="closeDropdown">
                  <i class="bi bi-person-plus"></i> Sign Up
                </router-link>
              </template>
              <template v-else>
                <router-link to="/cart" class="dropdown-item-link" @click="closeDropdown">
                  <i class="bi bi-bag"></i> My Cart
                </router-link>
                <button class="dropdown-item-link danger" @click="logout">
                  <i class="bi bi-box-arrow-right"></i> Logout
                </button>
              </template>
            </div>
          </transition>
        </div>

        <!-- Mobile Hamburger -->
        <button class="nav-icon-btn mobile-only" @click="mobileOpen = !mobileOpen">
          <i :class="mobileOpen ? 'bi bi-x-lg' : 'bi bi-list'"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition name="slide-down">
      <div v-if="mobileOpen" class="mobile-menu">
        <div class="mobile-search">
          <i class="bi bi-search"></i>
          <input type="text" placeholder="Search products..." class="search-field" />
        </div>
        <router-link to="/home" class="mobile-link" @click="mobileOpen=false">
          <i class="bi bi-house"></i> Home
        </router-link>
        <router-link to="/products" class="mobile-link" @click="mobileOpen=false">
          <i class="bi bi-grid"></i> Products
        </router-link>
        <router-link to="/cart" class="mobile-link" @click="mobileOpen=false">
          <i class="bi bi-bag"></i> Cart
          <span v-if="cartCount > 0" class="nav-badge inline-badge">{{ cartCount }}</span>
        </router-link>
        <router-link to="/about" class="mobile-link" @click="mobileOpen=false">
          <i class="bi bi-info-circle"></i> About
        </router-link>
        <button v-if="isLoggedIn" class="mobile-link danger" @click="logout">
          <i class="bi bi-box-arrow-right"></i> Logout
        </button>
      </div>
    </transition>
  </nav>
</template>

<script>
import { cart } from "@/store/cart";
import { computed } from "vue";

export default {
  name: "AppNavbar",
  directives: {
    'click-outside': {
      mounted(el, binding) {
        el._clickOutsideHandler = (e) => {
          if (!el.contains(e.target)) binding.value(e);
        };
        document.addEventListener('click', el._clickOutsideHandler);
      },
      unmounted(el) {
        document.removeEventListener('click', el._clickOutsideHandler);
      }
    }
  },
  setup() {
    const cartCount = computed(() => cart.items.reduce((t, i) => t + i.quantity, 0));
    return { cart, cartCount };
  },
  data() {
    return {
      scrolled: false,
      dropdownOpen: false,
      mobileOpen: false,
      searchQuery: '',
      isLoggedIn: !!localStorage.getItem("token"),
      userName: localStorage.getItem("userName") || "User",
    };
  },
  computed: {
    userInitial() {
      return this.userName ? this.userName.charAt(0).toUpperCase() : 'U';
    }
  },
  watch: {
    searchQuery(newVal) {
      if (newVal.trim()) {
        // If not on products page, go there
        if (this.$route.path !== '/products') {
          this.$router.push({ path: '/products', query: { q: newVal }});
        } else {
          // If already on products page, update query param silently
          this.$router.replace({ query: { ...this.$route.query, q: newVal }});
        }
      } else {
        // If query is empty and we are on products page, clear it
        if (this.$route.path === '/products') {
          this.$router.replace({ query: { ...this.$route.query, q: undefined }});
        }
      }
    },
    '$route.query.q': {
      immediate: true,
      handler(newVal) {
        if (newVal !== this.searchQuery) {
          this.searchQuery = newVal || "";
        }
      }
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.scrolled = window.scrollY > 20;
    },
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    closeDropdown() {
      this.dropdownOpen = false;
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("isLoggedIn");
      this.isLoggedIn = false;
      this.dropdownOpen = false;
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.app-nav {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(17, 18, 20, 0.7);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid transparent;
  transition: all 0.3s ease;
}
.app-nav.nav-scrolled {
  background: rgba(17, 18, 20, 0.92);
  border-bottom-color: rgba(255,255,255,0.06);
  box-shadow: 0 4px 30px rgba(0,0,0,0.3);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 72px;
  display: flex;
  align-items: center;
  gap: 24px;
}
.nav-utils.left { flex: 0 0 auto; }
.nav-brand { flex: 0 0 auto; }
.nav-search-wrap { flex: 1; min-width: 200px; }
.nav-actions { flex: 0 0 auto; display: flex; align-items: center; gap: 20px; }

/* Brand */
.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
  margin: 0 10px;
}
.brand-name {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 800;
  font-size: 22px;
  letter-spacing: -0.04em;
}

/* Utils */
.nav-utils {
  display: flex;
  gap: 18px;
  align-items: center;
}
.util-link {
  color: var(--text-muted);
  font-size: 13.5px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.util-link:hover {
  color: #f97316;
}
.join-btn {
  color: #f97316;
  border: 1px solid rgba(249, 115, 22, 0.3);
  padding: 4px 12px;
  border-radius: 6px;
}
.join-btn:hover {
  background: rgba(249, 115, 22, 0.1);
  border-color: #f97316;
}
.brand-shop { color: #f97316; }
.brand-vibe { color: #ffffff; }

/* Search */
.nav-search-wrap { flex: 1; max-width: 480px; }
.nav-search {
  position: relative;
  display: flex;
  align-items: center;
}
.search-ico {
  position: absolute;
  left: 14px;
  color: #64748b;
  font-size: 14px;
  pointer-events: none;
}
.search-field {
  width: 100%;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 100px;
  color: #fff;
  padding: 8px 40px 8px 38px;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s ease;
  outline: none;
}
.search-field:focus {
  background: rgba(255,255,255,0.08);
  border-color: rgba(249,115,22,0.4);
  box-shadow: 0 0 0 3px rgba(249,115,22,0.1);
}
.search-field::placeholder { color: #475569; }
.search-clear {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  font-size: 14px;
}

/* Actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: 8px;
}
.nav-link-item {
  color: #94a3b8;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}
.nav-link-item:hover, .nav-link-item.active {
  color: #fff;
  background: rgba(255,255,255,0.06);
}

.nav-icon-btn {
  position: relative;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
  text-decoration: none;
  flex-shrink: 0;
}
.nav-icon-btn:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.15);
  color: #fff;
}

.nav-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: linear-gradient(135deg, #f43f5e, #dc2626);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  border-radius: 100px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}
.inline-badge {
  position: static;
  display: inline-flex;
  margin-left: 6px;
}

/* Account */
.nav-account { position: relative; }
.account-btn { overflow: hidden; }
.avatar-mini {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f97316, #f59e0b);
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
}

.account-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: rgba(15, 23, 42, 0.96);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 8px;
  min-width: 200px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  z-index: 100;
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
}
.dh-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #f97316, #f59e0b);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  flex-shrink: 0;
}
.dh-name { color: #fff; font-weight: 600; font-size: 14px; }
.dh-label { color: #64748b; font-size: 12px; }

.dropdown-item-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 10px;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.15s ease;
  background: none;
  border: none;
  width: 100%;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
}
.dropdown-item-link:hover {
  background: rgba(255,255,255,0.06);
  color: #fff;
}
.dropdown-item-link.danger { color: #f87171; }
.dropdown-item-link.danger:hover { background: rgba(239,68,68,0.1); color: #fca5a5; }

/* Mobile Menu */
.mobile-menu {
  border-top: 1px solid rgba(255,255,255,0.06);
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: rgba(17,18,20,0.95);
}
.mobile-search {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  padding: 8px 14px;
  margin-bottom: 8px;
  color: #64748b;
}
.mobile-search .search-field {
  background: none;
  border: none;
  padding: 0;
  font-size: 14px;
  box-shadow: none;
}
.mobile-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  color: #94a3b8;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.15s ease;
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  width: 100%;
}
.mobile-link:hover, .mobile-link.router-link-active {
  background: rgba(255,255,255,0.06);
  color: #fff;
}
.mobile-link.danger { color: #f87171; }

/* Responsive */
.desktop-only { display: flex; }
.mobile-only { display: none !important; }

@media (max-width: 768px) {
  .desktop-only { display: none !important; }
  .mobile-only { display: flex !important; }
}

/* Dropdown transition */
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.2s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-8px); }

/* Slide down */
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.25s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
