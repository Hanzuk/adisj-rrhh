<template>
  <div class="mt-10">
    <div class="container">
      <h3 class="subtitle is-3">¡Bienvenido {{ auth.user.nombre }}!</h3>
      <h5 class="subtitle is-5">Tus solicitudes revisadas</h5>
      <div class="columns is-multiline">
        <div class="column is-3">
          <div class="box">
            <nav class="level">
              <div class="level-item has-text-centered">
                <div>
                  <p class="heading">Permisos aprobados</p>
                  <p class="title">{{ dashData.permisos_aprobados }}</p>
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
                  <p class="heading">Permisos rechazados</p>
                  <p class="title">{{ dashData.permisos_rechazados }}</p>
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
                  <p class="heading">Horas extra aprobadas</p>
                  <p class="title">{{ dashData.horas_extras_aprobados }}</p>
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
                  <p class="heading">Horas extra rechazadas</p>
                  <p class="title">{{ dashData.horas_extras_rechazados }}</p>
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
                  <p class="heading">Permisos solicitados</p>
                  <p class="title">{{ dashData.permisos_solicitados }}</p>
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
                  <p class="title">{{ dashData.horas_extras_solicitados }}</p>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>

      <h5 class="subtitle is-5">Otros</h5>
      <div class="columns is-multiline">
        <div class="column is-3">
          <div class="box">
            <nav class="level">
              <div class="level-item has-text-centered">
                <div>
                  <p class="heading">Tareas asignadas</p>
                  <p class="title">{{ dashData.tareas_asignadas }}</p>
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
                  <p class="heading">Amonestaciones</p>
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
                  <p class="heading">Felicitaciones</p>
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
  name: 'DashboardEmployee',
  computed: {
    ...mapState(['auth']),
  },
  data() {
    return {
      dashData: {
        permisos_aprobados: 0,
        permisos_rechazados: 0,
        horas_extras_aprobados: 0,
        horas_extras_rechazados: 0,
        permisos_solicitados: 0,
        horas_extras_solicitados: 0,
        tareas_asignadas: 0,
        amonestaciones: 0,
        felicitaciones: 0,
      },
    };
  },
  async created() {
    const { data } = await Service.dashEmployee();
    this.dashData = data;
  },
};
</script>
