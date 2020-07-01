<template>
  <div class="card">
    <div class="card-content">
      <h1 class="is-size-5 has-text-weight-semibold mb-3">{{ permit.titulo }}</h1>
      <b-taglist class="mb-0 important" attached>
        <b-tag type="is-light">Estado</b-tag>
        <b-tag :type="statusTag(permit.id_estado)">{{ status(permit.id_estado) }}</b-tag>
      </b-taglist>
      <p class="mb-4">{{ permit.descripcion }}</p>
      <b-field grouped>
        <div class="control">
          <b-taglist attached>
            <b-tag type="is-dark">Salida</b-tag>
            <b-tag type="is-primary">{{ formatDate(permit.fecha_salida) }} {{ formatTime(permit.fecha_salida) }}</b-tag>
          </b-taglist>
        </div>
        <div class="control">
          <b-taglist attached>
            <b-tag type="is-dark">Duración</b-tag>
            <b-tag type="is-primary">{{ permit.horas }} horas</b-tag>
          </b-taglist>
        </div>
      </b-field>
      <p class="leading-none">{{ permit.empleado }}</p>
      <p class="has-text-grey">Hace {{ createdAgo(permit.fecha_solicitud) }}</p>
    </div>
    <footer class="card-footer">
      <a class="card-footer-item" v-if="userType === 1" @click="accept(permit.id)">Aceptar</a>
      <a class="card-footer-item" v-if="userType === 1" @click="reject(permit.id)">Rechazar</a>
      <a class="card-footer-item" v-if="userType !== 1" @click="openUpdateModal(permit.id)">Editar</a>
      <a class="card-footer-item" @click="remove(permit.id)">Borrar</a>
    </footer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { lightFormat, formatDistance } from 'date-fns';
import es from 'date-fns/locale/es';
import Service from '@/services/AdisjService.js';
import PermitUpdate from '@/components/permit/PermitUpdate.vue';

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
  name: 'PermitCard',
  props: {
    permit: {
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
    ...mapActions('permits', ['deletePermit', 'acceptPermit', 'rejectPermit']),
    async accept(permitId) {
      try {
        await Service.putPermit(permitId, JSON.stringify({ id_estado: 2 }));
        this.acceptPermit(permitId);
        this.$buefy.toast.open({
          duration: 1500,
          message: '¡El permiso ha sido aceptado!',
          type: 'is-success',
        });
      } catch (error) {
        this.$buefy.toast.open({
          duration: 1500,
          message: '¡Hubo un error al aceptar este permiso!',
          type: 'is-danger',
        });
      }
    },
    async reject(permitId) {
      try {
        await Service.putPermit(permitId, JSON.stringify({ id_estado: 3 }));
        this.rejectPermit(permitId);
        this.$buefy.toast.open({
          duration: 1500,
          message: '¡El permiso ha rechazado!',
          type: 'is-success',
        });
      } catch (error) {
        this.$buefy.toast.open({
          duration: 1500,
          message: '¡Hubo un error al rechazar este permiso!',
          type: 'is-danger',
        });
      }
    },
    remove(permitId) {
      this.$buefy.dialog.confirm({
        title: `Borrar ${this.permit.titulo}`,
        message: '¿Seguro que quieres <b>borrar</b> este permiso? Esta acción no se puede revertir.',
        confirmText: 'Borrar',
        cancelText: 'Cancelar',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: async () => {
          try {
            await Service.deletePermit(permitId);
            this.deletePermit(permitId);
            this.$buefy.toast.open({
              duration: 3000,
              message: '¡Éxito al borrar el permiso!',
              type: 'is-success',
            });
          } catch (error) {
            this.$parent.close();
            this.$buefy.toast.open({
              duration: 3000,
              message: '¡Hubo un error al borrar este permiso!',
              type: 'is-danger',
            });
          }
        },
      });
    },
    openUpdateModal(permitId) {
      this.$buefy.modal.open({
        parent: this,
        component: PermitUpdate,
        hasModalCard: true,
        trapFocus: true,
        'has-modal-card': true,
        width: 600,
        props: {
          permitId,
        },
      });
    },
  },
};
</script>
