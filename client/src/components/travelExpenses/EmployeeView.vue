<template>
  <div class="mt-10">
    <div class="container">
      <div class="box">
        <h4 class="is-size-5 has-text-weight-semibold mb-3">Mis viáticos</h4>
        <div class="columns is-multiline">
          <div v-for="viatico in viaticos" :key="viatico.id" class="column is-3">
            <div class="box">
              <h4 class="is-size-6 has-text-weight-semibold mb-1">Motivo</h4>
              <p class="mb-3">{{ viatico.motivo }}</p>
              <b-field grouped>
                <div class="control">
                  <b-taglist class="mb-0 important" attached>
                    <b-tag type="is-dark">Otorgados el</b-tag>
                    <b-tag type="is-primary">{{ formatDate(viatico.fecha) }}</b-tag>
                  </b-taglist>

                  <b-taglist attached>
                    <b-tag type="is-dark">Monto</b-tag>
                    <b-tag type="is-primary">{{ formatAmount(viatico.monto) }}</b-tag>
                  </b-taglist>
                </div>
              </b-field>
              <p class="has-text-grey is-size-6">Hace {{ createdAgo(viatico.fecha) }}</p>
            </div>
          </div>

          <div v-if="viaticos.length === 0" class="column is-full">
            <section class="section has-text-centered has-text-grey">
              <p class="mb-3">
                <b-icon icon="emoticon-sad" size="is-large"> </b-icon>
              </p>
              <p>No tienes ninguna felicitación por el momento.</p>
            </section>
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
import numeral from 'numeral';

export default {
  name: 'TravelExpensesEmployeeView',
  data() {
    return {
      viaticos: [],
    };
  },
  computed: {
    formatDate() {
      return date => lightFormat(new Date(date), 'dd/MM/yy');
    },
    createdAgo() {
      return date => formatDistance(new Date(), new Date(date), { includeSeconds: true, locale: es });
    },
    formatAmount() {
      return amount => numeral(amount).format('$0,0.00');
    },
  },
  async created() {
    const { data } = await Service.getViaticos();
    this.viaticos = data;
  },
};
</script>

<style>
.mb-0.important {
  margin-bottom: 0 !important;
}
</style>
