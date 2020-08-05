<template>
  <b-navbar wrapper-class="container" :shadow="true" :fixed-top="true">
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ name: 'dashboard' }">
        <img src="../assets/logo_adisj.jpg" alt="Asociación de Desarrollo Integral de San Juan Puriscal" />
      </b-navbar-item>
    </template>
    <template slot="start">
      <b-navbar-item tag="router-link" :to="{ name: 'dashboard' }">Inicio</b-navbar-item>
      <b-navbar-dropdown label="Empleados" v-if="user.tipo_empleado == 1">
        <b-navbar-item tag="router-link" :to="{ name: 'employee-create' }">Nuevo empleado</b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 'employees' }">Información empleados</b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-dropdown label="Permisos">
        <b-navbar-item tag="router-link" :to="{ name: 'permit-create' }" v-if="user.tipo_empleado != 1"
          >Solicitar permiso</b-navbar-item
        >
        <b-navbar-item tag="router-link" :to="{ name: 'permits' }">Ver permisos</b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-dropdown label="Horas extra">
        <b-navbar-item tag="router-link" :to="{ name: 'overtime-create' }" v-if="user.tipo_empleado != 1"
          >Solicitar horas extra</b-navbar-item
        >
        <b-navbar-item tag="router-link" :to="{ name: 'overtime' }">Ver horas extras</b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-dropdown label="Planilla" v-if="user.tipo_empleado == 1 || user.tipo_empleado == 2">
        <b-navbar-item tag="router-link" :to="{ name: 'payroll' }">Cálculo salarial</b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 'increases' }" v-if="user.tipo_empleado == 1"
          >Aumentos salariales</b-navbar-item
        >
        <b-navbar-item tag="router-link" :to="{ name: 'withholding' }" v-if="user.tipo_empleado == 1"
          >Retenciones salariales</b-navbar-item
        >
        <b-navbar-item tag="router-link" :to="{ name: 'handicaps' }" v-if="user.tipo_empleado == 1"
          >Incapacidades</b-navbar-item
        >
        <b-navbar-item tag="router-link" :to="{ name: 'travelExp' }" v-if="user.tipo_empleado == 1"
          >Viáticos</b-navbar-item
        >
      </b-navbar-dropdown>
      <b-navbar-dropdown label="Control disciplinario">
        <b-navbar-item tag="router-link" :to="{ name: 'quality-control' }" v-if="user.tipo_empleado == 1"
          >Calidad servicio de choferes</b-navbar-item
        >
        <b-navbar-item tag="router-link" :to="{ name: 'warnings' }">Amonestaciones</b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 'congrats' }">Felicitaciones</b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-dropdown label="Tareas">
        <b-navbar-item tag="router-link" :to="{ name: 'new-task' }" v-if="user.tipo_empleado == 1"
          >Nueva tarea</b-navbar-item
        >
        <b-navbar-item tag="router-link" :to="{ name: 'tasks' }">Ver tareas</b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-dropdown label="Vacaciones">
        <b-navbar-item tag="router-link" :to="{ name: 'new-vacation' }">Solicitar vacaciones</b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 'vacations' }" v-if="user.tipo_empleado == 1"
          >Ver vacaciones solicitadas</b-navbar-item
        >
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
import { mapState } from 'vuex';

export default {
  name: 'Navbar',
  computed: {
    ...mapState({
      user: state => state.auth.user,
    }),
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout');
    },
  },
};
</script>
