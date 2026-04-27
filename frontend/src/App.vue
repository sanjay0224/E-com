<script>
import { useRoute } from "vue-router";
import NavbarPage from "./components/NavbarPage.vue";
import AiChat from "./components/AiChat.vue";

export default {
  name: "App",
  components: { NavbarPage, AiChat },
  setup() {
    const route = useRoute();
    const hideNavbarOn = ["/login", "/signup"];
    return { route, hideNavbarOn };
  },
};
</script>

<template>
  <div>
    <NavbarPage v-if="!hideNavbarOn.includes(route.path)" />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <AiChat v-if="!hideNavbarOn.includes(route.path)" />
  </div>
</template>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
