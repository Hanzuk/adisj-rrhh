<template>
  <div class="mt-10">
    <div class="container">
      <div class="columns is-multiline">
        <div class="column is-full">
          <div class="box">
            <h4 class="title is-4">Ranking</h4>
            <b-message type="is-info">
              Muestra las calificaciones asignadas a los choferes en base a la calidad del servicio que brindaron según
              los clientes que completaron el formulario.
            </b-message>
            <b-table
              :data="quality.rating"
              :paginated="true"
              :per-page="10"
              :hoverable="true"
              :striped="true"
              @select="row => selectDriver(row)"
              :selected.sync="driverSelected"
            >
              <template slot-scope="props">
                <b-table-column label="ID" width="40" numeric centered>
                  {{ props.row.id_empleado }}
                </b-table-column>
                <b-table-column label="Nombre del chofer">
                  {{ props.row.nombre }} {{ props.row.p_apellido }}
                </b-table-column>
                <b-table-column field="calificacion" label="Calificación" width="100" numeric centered sortable>
                  <span class="tag" :class="type(props.row.calificacion)">
                    {{ props.row.calificacion }}
                  </span>
                </b-table-column>
              </template>

              <template slot="empty">
                <section class="section">
                  <div class="content has-text-grey has-text-centered">
                    <p>
                      <b-icon icon="emoticon-sad" size="is-large"> </b-icon>
                    </p>
                    <p>Ningún chofer ha recibido calificaciones por parte de los clientes.</p>
                  </div>
                </section>
              </template>
            </b-table>
          </div>
        </div>

        <div class="column is-full">
          <div class="box">
            <h4 class="title is-4">Detalles</h4>
            <b-message type="is-info">
              Muestra información de los formularios completados para determinado chofer.
            </b-message>
            <b-table :data="quality.userRating" :paginated="true" :per-page="20" :hoverable="true" :striped="true">
              <template slot-scope="props">
                <b-table-column field="client-name" label="Nombre del cliente" width="300">
                  {{ props.row.nombre_cliente }}
                </b-table-column>
                <b-table-column field="comment" label="Comentario">
                  {{ props.row.nombre }} {{ props.row.comentario }}
                </b-table-column>
                <b-table-column field="calificacion" label="Calificación" width="100" numeric centered sortable>
                  <span class="tag" :class="type(props.row.calificacion)">
                    {{ props.row.calificacion }}
                  </span>
                </b-table-column>
                <b-table-column field="fecha" label="Fecha" width="100" centered sortable>
                  <b-tag type="is-light">{{ formatDate(props.row.fecha) }}</b-tag>
                </b-table-column>
                <b-table-column label="Acciones" width="100" centered>
                  <b-button type="is-danger" icon-right="delete" @click="deleteVote(props.row.id)" />
                </b-table-column>
              </template>

              <template slot="empty">
                <section class="section">
                  <div class="content has-text-grey has-text-centered">
                    <p>
                      <b-icon icon="emoticon-sad" size="is-large"> </b-icon>
                    </p>
                    <p>Selecciona un chofer para ver los votos que recibió por parte de los clientes.</p>
                  </div>
                </section>
              </template>
            </b-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { format } from 'date-fns';
import Service from '@/services/AdisjService.js';

export default {
  name: 'QualityControl',
  computed: {
    ...mapState(['quality']),
    formatDate() {
      return date => format(new Date(date), 'dd/MM/yyyy');
    },
  },
  data() {
    return {
      driverSelected: null,
    };
  },
  created() {
    this.$store.dispatch('quality/fetchRating');
  },
  methods: {
    type(value) {
      const number = parseFloat(value);
      if (number < 3) {
        return 'is-danger';
      } else if (number >= 3 && number < 4) {
        return 'is-warning';
      } else if (number >= 4) {
        return 'is-success';
      }
    },
    selectDriver(row) {
      this.$store.dispatch('quality/fetchUserRating', row.id_empleado);
    },
    async deleteVote(voteId) {
      try {
        await Service.deleteVote(voteId);
        this.$store.dispatch('quality/fetchUserRating', this.driverSelected.id_empleado);
        this.$store.dispatch('quality/fetchRating');

        this.$buefy.toast.open({
          duration: 2000,
          message: 'Voto eliminado.',
          type: 'is-success',
        });
      } catch (error) {
        this.$buefy.toast.open({
          duration: 2000,
          message: 'No se pudo eliminar el voto.',
          type: 'is-danger',
        });
      }
    },
  },
};
</script>
