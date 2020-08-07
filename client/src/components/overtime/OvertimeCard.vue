<template>
  <div class="card">
    <div class="card-content">
      <b-taglist class="mb-2 important" attached>
        <b-tag type="is-light">Estado</b-tag>
        <b-tag :type="statusTag(overtimeRequest.id_estado)">{{ status(overtimeRequest.id_estado) }}</b-tag>
      </b-taglist>
      <p class="mb-4">{{ overtimeRequest.descripcion }}</p>
      <b-field grouped>
        <div class="control">
          <b-taglist attached>
            <b-tag type="is-dark">Solicitado</b-tag>
            <b-tag type="is-primary"
              >{{ formatDate(overtimeRequest.fecha) }} {{ formatTime(overtimeRequest.fecha) }}</b-tag
            >
          </b-taglist>
        </div>
        <div class="control">
          <b-taglist attached>
            <b-tag type="is-dark">Cantidad</b-tag>
            <b-tag type="is-primary">{{ overtimeRequest.cantidad_horas }} horas</b-tag>
          </b-taglist>
        </div>
      </b-field>
      <p class="leading-none">{{ overtimeRequest.empleado }}</p>
      <p class="has-text-grey">Hace {{ createdAgo(overtimeRequest.fecha) }}</p>
    </div>
    <footer class="card-footer">
      <a class="card-footer-item" v-if="userType === 1" @click="accept(overtimeRequest.id)">Aceptar</a>
      <a class="card-footer-item" v-if="userType === 1" @click="reject(overtimeRequest.id)">Rechazar</a>
      <a class="card-footer-item" v-if="userType !== 1" @click="openUpdateModal(overtimeRequest.id)">Editar</a>
      <a class="card-footer-item" v-if="userType === 1" @click="remove(overtimeRequest.id)">Borrar</a>
    </footer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { lightFormat, formatDistance } from 'date-fns';
import es from 'date-fns/locale/es';
import Service from '@/services/AdisjService.js';
import OvertimeUpdate from '@/components/overtime/OvertimeUpdate.vue';

const statusTypes = new Map([
  [1, 'Pendiente'],
  [2, 'Aprobado'],
  [3, 'Rechazado'],
]);

const statusTagClasses = new Map([
  [1, 'is-warning'],
  [2, 'is-success'],
  [3, 'is-danger'],
]);

export default {
  name: 'OvertimeCard',
  props: {
    overtimeRequest: {
      type: Object,
      default: null,
    },
  },
  computed: {
    ...mapGetters('auth', ['userType']),
    statusTag() {
      return status => statusTagClasses.get(status);
    },
    status() {
      return status => statusTypes.get(status);
    },
    formatDate() {
      return date => lightFormat(new Date(date), 'dd/MM/yy');
    },
    formatTime() {
      return date => lightFormat(new Date(date), 'h:mm aaaa');
    },
    createdAgo() {
      return date => formatDistance(new Date(), new Date(date), { includeSeconds: true, locale: es });
    },
  },
  methods: {
    ...mapActions('overtime', ['acceptOvertime', 'rejectOvertime', 'deleteOvertime']),
    async accept(id) {
      try {
        await Service.putOvertime(id, JSON.stringify({ id_estado: 2 }));
        this.acceptOvertime(id);
        this.$buefy.toast.open({
          duration: 1500,
          message: '¡Las horas extras han sido aceptadas!',
          type: 'is-success',
        });
      } catch (error) {
        this.$buefy.toast.open({
          duration: 1500,
          message: '¡Hubo un error al aceptar estas horas extras!',
          type: 'is-danger',
        });
      }
    },
    async reject(id) {
      try {
        await Service.putOvertime(id, JSON.stringify({ id_estado: 3 }));
        this.rejectOvertime(id);
        this.$buefy.toast.open({
          duration: 1500,
          message: '¡Las horas extras han sido rechazadas!',
          type: 'is-success',
        });
      } catch (error) {
        this.$buefy.toast.open({
          duration: 1500,
          message: '¡Hubo un error al rechazar estas horas extras!',
          type: 'is-danger',
        });
      }
    },
    remove(overTimeId) {
      this.$buefy.dialog.confirm({
        title: `Borrar horas extras`,
        message: '¿Seguro que quieres <b>borrar</b> estas horas extras? Esta acción no se puede revertir.',
        confirmText: 'Borrar',
        cancelText: 'Cancelar',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: async () => {
          try {
            await Service.deleteOvertime(overTimeId);
            this.deleteOvertime(overTimeId);
            this.$buefy.toast.open({
              duration: 3000,
              message: '¡Éxito al borrar las horas extras!',
              type: 'is-success',
            });
          } catch (error) {
            this.$parent.close();
            this.$buefy.toast.open({
              duration: 3000,
              message: '¡Hubo un error al borrar las horas extras!',
              type: 'is-danger',
            });
          }
        },
      });
    },
    openUpdateModal(id) {
      this.$buefy.modal.open({
        parent: this,
        component: OvertimeUpdate,
        trapFocus: true,
        'has-modal-card': true,
        width: 600,
        props: {
          overtimeId: id,
        },
      });
    },
  },
};
</script>

<style>
.mb-2.important {
  margin-bottom: 0.5rem !important;
}
</style>
