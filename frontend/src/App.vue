<script>
import { useRoute } from "vue-router";
import NavbarPage from "./components/NavbarPage.vue";

export default {
  name: "App",
  components: { NavbarPage },
  setup() {
    const route = useRoute();

    // pages where we don't want Navbar
    const hideNavbarOn = ["/login", "/signup"];

    return { route, hideNavbarOn };
  },
};
</script>

<template>
  <div>
    <!-- Show Navbar only if not on login/signup -->
    <NavbarPage v-if="!hideNavbarOn.includes(route.path)" />

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
