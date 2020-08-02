<template>
  <b-navbar wrapper-class="container" :shadow="true" :fixed-top="true">
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
      <b-navbar-dropdown label="Permisos">
        <b-navbar-item tag="router-link" :to="{ name: 'permit-create' }">Solicitar permiso</b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 'permits' }">Ver permisos</b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-dropdown label="Horas extra">
        <b-navbar-item tag="router-link" :to="{ name: 'overtime-create' }">Solicitar horas extra</b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 'overtime' }">Ver horas extras</b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-dropdown label="Planilla">
        <b-navbar-item tag="router-link" :to="{ name: 'payroll' }">Cálculo salarial</b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 'increases' }">Aumentos salariales</b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 'withholding' }">Retenciones salariales</b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 'handicaps' }">Incapacidades</b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 'travelExp' }">Viáticos</b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-dropdown label="Control disciplinario">
        <b-navbar-item tag="router-link" :to="{ name: 'quality-control' }">Calidad servicio de choferes</b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 'warnings' }">Amonestaciones</b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 'congrats' }">Felicitaciones</b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-dropdown label="Tareas">
        <b-navbar-item tag="router-link" :to="{ name: 'new-task' }">Nueva tarea</b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 'tasks' }">Ver tareas</b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-dropdown label="Vacaciones">
        <b-navbar-item tag="router-link" :to="{ name: 'new-vacation' }">Solicitar vacaciones</b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 'vacations' }">Ver vacaciones activas</b-navbar-item>
      </b-navbar-dropdown>
    </template>

    <template slot="end">
      <b-navbar-item tag="router-link" :to="{ name: 'profile' }">
        <b-icon icon="account-circle"></b-icon>
        <span class="ml-2">Perfil</span>
      </b-navbar-item>
      <b-navbar-item tag="div">
        <div class="buttons">
          <button class="button is-light" @click="logout">
            <b-icon icon="logout"></b-icon>
            <span>Cerrar sesión</span>
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
