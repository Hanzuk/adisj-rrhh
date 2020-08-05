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
                  <p class="title">{{ dashData.permisos }}</p>
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
                  <p class="title">{{ dashData.horas_extras }}</p>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>

      <h5 class="subtitle is-5">Acciones realizadas durante el mes</h5>
      <div class="columns is-multiline">
        <div class="column is-3">
          <div class="box">
            <nav class="level">
              <div class="level-item has-text-centered">
                <div>
                  <p class="heading">Permisos aceptados o rechazados</p>
                  <p class="title">{{ dashData.permisos_tramitados }}</p>
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
                  <p class="heading">Horas extra aceptadas o rechazadas</p>
                  <p class="title">{{ dashData.horas_extras_tramitadas }}</p>
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
                  <p class="heading">Tareas asignadas</p>
                  <p class="title">{{ dashData.tareas }}</p>
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
                  <p class="heading">Amonestaciones asignadas</p>
                  <p class="title">{{ dashData.amonestaciones }}</p>
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
                  <p class="heading">Felicitaciones asignadas</p>
                  <p class="title">{{ dashData.felicitaciones }}</p>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Service from '@/services/AdisjService.js';

export default {
  name: 'DashboardAdmin',
  computed: {
    ...mapState(['auth']),
  },
  data() {
    return {
      dashData: {
        permisos: 0,
        horas_extras: 0,
        permisos_tramitados: 0,
        horas_extras_tramitadas: 0,
        tareas: 0,
        amonestaciones: 0,
        felicitaciones: 0,
      },
    };
  },
  async created() {
    const { data } = await Service.dashAmind();
    this.dashData = data;
  },
};
</script>
