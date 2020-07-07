<template>
  <div class="mt-10">
    <div class="container">
      <div class="box">
        <h4 class="is-size-5 has-text-weight-semibold mb-3">Mis amonestaciones</h4>
        <div class="columns is-multiline">
          <div v-for="warning in warnings" :key="warning.id" class="column is-3">
            <div class="box">
              <h4 class="is-size-6 has-text-weight-semibold mb-1">Motivo</h4>
              <p class="mb-3">{{ warning.descripcion }}</p>
              <b-field grouped>
                <div class="control">
                  <b-taglist attached>
                    <b-tag type="is-dark">Creada el</b-tag>
                    <b-tag type="is-primary">{{ formatDate(warning.fecha) }}</b-tag>
                  </b-taglist>
                </div>
              </b-field>
              <p class="has-text-grey is-size-6">Hace {{ createdAgo(warning.fecha) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Service from '@/services/AdisjService.js';
import { lightFormat, formatDistance } from 'date-fns';
import es from 'date-fns/locale/es';

export default {
  name: 'WarningsEmployeeView',
  data() {
    return {
      warnings: [],
    };
  },
  computed: {
    formatDate() {
      return date => lightFormat(new Date(date), 'dd/MM/yy');
    },
    createdAgo() {
      return date => formatDistance(new Date(), new Date(date), { includeSeconds: true, locale: es });
    },
  },
  async created() {
    this.$store.dispatch('employees/fetchEmployees');
    const { data } = await Service.getWarnings();
    this.warnings = data;
  },
};
</script>
