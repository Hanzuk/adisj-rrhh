<template>
  <div class="mt-10">
    <div class="container">
      <h3 class="subtitle is-3">¡Bienvenido {{ auth.user.nombre }}!</h3>
      <h5 class="subtitle is-5">Nuevas solicitudes por revisar</h5>
      <div class="columns is-multiline">
        <div class="column is-3">
          <div class="box">
            <nav class="level">
              <div class="level-item has-text-centered">
                <div>
                  <p class="heading">Permisos solicitados</p>
                  <p class="title">0</p>
                </div>
              </div>
            </nav>
          </div>
        </div>

        <div class="column is-3">
          <div class="box">
            <nav class="level">
              <div class="level-item has-text-centered">
                <div>
                  <p class="heading">Horas extra solicitadas</p>
                  <p class="title">0</p>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>

      <h5 class="subtitle is-5">Nuevas solicitudes realizadas hoy</h5>
    </div>
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
