<template>
  <div class="card">
    <div class="card-content">
      <h5 class="is-size-5 has-text-weight-semibold mb-2">{{ task.titulo }}</h5>
      <h6 class="is-size-6 has-text-weight-semibold">Descripción</h6>
      <p class="mb-4">{{ task.descripcion }}</p>
      <b-taglist class="mb-0 important" attached>
        <b-tag type="is-dark">Asignada a</b-tag>
        <b-tag type="is-info">{{ task.asignada_a }}</b-tag>
      </b-taglist>
      <p class="has-text-grey leading-none">Hace {{ createdAgo(task.fecha_asignacion) }}</p>
    </div>
    <footer class="card-footer">
      <a class="card-footer-item" @click="openTaskModal(task.id)">Mas información</a>
      <a class="card-footer-item" v-if="userType === 1" @click="removeTask(task.id)">Eliminar tarea</a>
    </footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { formatDistance } from 'date-fns';
import es from 'date-fns/locale/es';
import Service from '@/services/AdisjService.js';
import TaskModal from '@/components/tasks/TaskModal.vue';

export default {
  name: 'TaskCard',
  props: {
    task: {
      type: Object,
      default: null,
    },
  },
  computed: {
    ...mapGetters('auth', ['userType']),
    createdAgo() {
      return date => formatDistance(new Date(), new Date(date), { includeSeconds: true, locale: es });
    },
  },
  methods: {
    removeTask(taskId) {
      this.$buefy.dialog.confirm({
        title: 'Eliminando tarea',
        message: '¿Seguro que quieres <b>eliminar</b> esta tarea? Esta acción no se puede deshacer.',
        confirmText: 'Eliminar tarea',
        cancelText: 'Cancelar',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: async () => {
          try {
            await Service.deleteTask(taskId);

            this.$buefy.toast.open({
              duration: 2500,
              message: 'Tarea eliminada con éxito.',
              type: 'is-success',
            });
          } catch (error) {
            this.$buefy.toast.open({
              duration: 2500,
              message: '¡Lo sentimos! La tarea no pudo ser eliminada.',
              type: 'is-danger',
            });
          }
        },
      });
    },
    openTaskModal(taskId) {
      this.$buefy.modal.open({
        parent: this,
        component: TaskModal,
        width: 600,
        props: { taskId },
      });
    },
  },
};
</script>

<style>
.mb-0.important {
  margin-bottom: 0 !important;
}
</style>
