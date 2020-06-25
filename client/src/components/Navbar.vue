<template>
  <b-navbar>
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ name: 'dashboard' }">
        <img src="../assets/logo_adisj.jpg" alt="Asociación de Desarrollo Integral de San Juan Puriscal" />
      </b-navbar-item>
    </template>
    <template slot="start">
      <b-navbar-item tag="router-link" :to="{ name: 'dashboard' }">Inicio</b-navbar-item>
      <b-navbar-dropdown label="Empleados">
        <b-navbar-item tag="router-link" :to="{ name: 'employee-create' }">Nuevo empleado</b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 'employees' }">Información empleados</b-navbar-item>
      </b-navbar-dropdown>
    </template>

    <template slot="end">
      <b-navbar-item tag="div">
        <div class="buttons">
          <button class="button is-primary" @click="logout">
            <strong>Cerrar sesión</strong>
          </button>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
export default {
  name: 'Navbar',
  methods: {
    logout() {
      this.$store.dispatch('auth/logout');
    },
  },
};
</script>
