<template>
  <div class="container">
    <h1 class="title is-3">Dashboard</h1>
    <h3 class="subtitle is-3">¡Bienvenido {{ auth.user.nombre }}!</h3>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Dashboard',
  computed: {
    ...mapState(['auth']),
  },
};
</script>
