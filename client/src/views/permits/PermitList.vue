<template>
  <div class="mt-10">
    <div class="container">
      <div class="box">
        <h4 class="title is-4">Permisos solicitados</h4>
        <b-tabs v-model="activeTab" type="is-boxed" @change="$store.dispatch('permits/fetchPermits')">
          <b-tab-item label="Pendientes">
            <div class="columns is-multiline" :class="{ 'is-centered': pendingPermits.length === 0 }">
              <div class="column is-4" v-for="permit in pendingPermits" :key="permit.id">
                <PermitCard :permit="permit" />
              </div>

              <div class="column is-half has-text-grey has-text-centered" v-if="pendingPermits.length === 0">
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
            <div class="columns is-multiline" :class="{ 'is-centered': approvedPermits.length === 0 }">
              <div class="column is-4" v-for="permit in approvedPermits" :key="permit.id">
                <PermitCard :permit="permit" />
              </div>

              <div class="column is-half has-text-grey has-text-centered" v-if="approvedPermits.length === 0">
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
            <div class="columns is-multiline" :class="{ 'is-centered': rejectedPermits.length === 0 }">
              <div class="column is-4" v-for="permit in rejectedPermits" :key="permit.id">
                <PermitCard :permit="permit" />
              </div>

              <div class="column is-half has-text-grey has-text-centered" v-if="rejectedPermits.length === 0">
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
import PermitCard from '@/components/permit/PermitCard.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'PermitList',
  components: {
    PermitCard,
  },
  data() {
    return {
      activeTab: 0,
    };
  },
  computed: {
    ...mapGetters('permits', ['pendingPermits', 'approvedPermits', 'rejectedPermits']),
    ...mapGetters('auth', ['userType']),
  },
  created() {
    this.$store.dispatch('permits/fetchPermits');
  },
};
</script>

<style scoped>
.h-full {
  height: 100%;
}

.mb-0.important {
  margin-bottom: 0 !important;
}
.mb-2.important {
  margin-bottom: 0.5rem !important;
}
</style>
