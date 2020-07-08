<template>
  <div class="mt-10">
    <div class="container">
      <div class="box">
        <h4 class="title is-4">Tareas asignadas</h4>
        <div class="columns is-multiline">
          <div class="column is-4" v-for="task in tasks" :key="task.id">
            <TaskCard :task="task" />
          </div>

          <div v-if="tasks.length === 0" class="column is-full">
            <section class="section has-text-centered has-text-grey">
              <p class="mb-3">
                <b-icon v-if="auth.user.tipo_empleado === 1" icon="emoticon-sad" size="is-large" />
                <b-icon v-if="auth.user.tipo_empleado !== 1" icon="emoticon-happy" size="is-large" />
              </p>
              <p v-if="auth.user.tipo_empleado === 1">
                No se han asigado tareas a los empleados por el momento. <br />
                Selecciona en el menú
                <span class="has-text-weight-bold">
                  Tareas > Nueva tarea
                </span>
                para asignar una.
              </p>
              <p v-if="auth.user.tipo_empleado !== 1">No te han asignado ninguna tarea.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TaskCard from '@/components/tasks/TaskCard.vue';
import Service from '@/services/AdisjService.js';
import { mapState } from 'vuex';

export default {
  name: 'TaskList',
  components: {
    TaskCard,
  },
  data() {
    return {
      tasks: [],
    };
  },
  computed: {
    ...mapState(['auth']),
  },
  async created() {
    const { data } = await Service.getTasks();
    this.tasks = data;
  },
};
</script>
