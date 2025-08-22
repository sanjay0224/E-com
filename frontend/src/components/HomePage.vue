<template>
  <div class="home text-center text-light py-5">
    <h1 class="fade-in-drop"> Welcome to E-Shop !!</h1>
    <p class="fade-in-rise">Your favorite place to buy cool gadgets.</p>
    <div class="mt-4">
      <router-link to="/products">
        <button class="btn btn-primary m-2">Browse Products</button>
      </router-link>
      <router-link to="/cart">
        <button class="btn btn-success m-2">View Cart</button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
};
</script>

<style scoped>
/* === Button Hover Animation === */
button {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
button:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

/* === H1 Animation: Drop In === */
.fade-in-drop {
  animation: dropFade 1s ease forwards;
  opacity: 0;
}
@keyframes dropFade {
  0% {
    transform: translateY(-40px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

/* === P Animation: Rise In === */
.fade-in-rise {
  animation: riseFade 1.2s ease 0.4s forwards;
  opacity: 0;
}
@keyframes riseFade {
  0% {
    transform: translateY(30px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
