<template>
  <div class="mt-10">
    <div class="container">
      <div class="box">
        <h4 class="title is-4">Solicitudes para horas extras</h4>
        <b-tabs v-model="activeTab" type="is-boxed" @change="$store.dispatch('overtime/fetchOvertime')">
          <b-tab-item label="Pendientes">
            <div class="columns is-multiline" :class="{ 'is-centered': pendingOvertime.length === 0 }">
              <div class="column is-4" v-for="overtime in pendingOvertime" :key="overtime.id">
                <OvertimeCard :overtimeRequest="overtime" />
              </div>

              <div class="column is-half has-text-grey has-text-centered" v-if="pendingOvertime.length === 0">
                <section class="section">
                  <p>
                    <b-icon icon="emoticon-sad" size="is-large"> </b-icon>
                  </p>
                  <p v-if="userType !== 1">No has solicitado ningún permiso. Solicita uno.</p>
                  <p v-else>No han solicitado ningún permiso.</p>
                </section>
              </div>
            </div>
          </b-tab-item>

          <b-tab-item label="Aprobados">
            <div class="columns is-multiline" :class="{ 'is-centered': approvedOvertime.length === 0 }">
              <div class="column is-4" v-for="overtime in approvedOvertime" :key="overtime.id">
                <OvertimeCard :overtimeRequest="overtime" />
              </div>

              <div class="column is-half has-text-grey has-text-centered" v-if="approvedOvertime.length === 0">
                <section class="section">
                  <p>
                    <b-icon icon="emoticon-sad" size="is-large"> </b-icon>
                  </p>
                  <p v-if="userType !== 1">No tienes permisos aprobados.</p>
                  <p v-else>No has aprobado ningún permiso.</p>
                </section>
              </div>
            </div>
          </b-tab-item>

          <b-tab-item label="Rechazados">
            <div class="columns is-multiline" :class="{ 'is-centered': rejectedOvertime.length === 0 }">
              <div class="column is-4" v-for="overtime in rejectedOvertime" :key="overtime.id">
                <OvertimeCard :overtimeRequest="overtime" />
              </div>

              <div class="column is-half has-text-grey has-text-centered" v-if="rejectedOvertime.length === 0">
                <section class="section">
                  <p>
                    <b-icon icon="emoticon-happy" size="is-large"> </b-icon>
                  </p>
                  <p v-if="userType !== 1">No tienes permisos rechazados.</p>
                  <p v-else>No has rechazado ningún permiso.</p>
                </section>
              </div>
            </div>
          </b-tab-item>
        </b-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import OvertimeCard from '@/components/overtime/OvertimeCard.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'OvertimeList',
  components: {
    OvertimeCard,
  },
  data() {
    return {
      activeTab: 0,
    };
  },
  computed: {
    ...mapGetters('overtime', ['pendingOvertime', 'approvedOvertime', 'rejectedOvertime']),
    ...mapGetters('auth', ['userType']),
  },
  created() {
    this.$store.dispatch('overtime/fetchOvertime');
  },
};
</script>
