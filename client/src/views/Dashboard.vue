<template>
  <div class="container">
    <Navbar />
    <h1 class="title is-3">Dashboard</h1>
    <h3 class="subtitle is-3">¡Bienvenido {user.name}!</h3>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'Dashboard',
  components: {
    Navbar,
  },
};
</script>
