<template>
  <div class="mt-10">
    <div class="container">
      <div class="box">
        <h4 class="title is-4">Tareas asignadas</h4>
        <div class="columns is-multiline">
          <div class="column is-4" v-for="task in tasks" :key="task.id">
            <TaskCard :task="task" />
          </div>

          <div class="column is-full">
            <section v-if="tasks.length === 0" class="section has-text-centered has-text-grey">
              <p class="mb-3">
                <b-icon icon="emoticon-sad" size="is-large"> </b-icon>
              </p>
              <p>
                No se han asigado tareas a los empleados por el momento. <br />
                Selecciona en el menú
                <spam class="has-text-weight-bold">
                  Tareas > Nueva tarea
                </spam>
                para asignar una.
              </p>
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
  async created() {
    const { data } = await Service.getTasks();
    this.tasks = data;
  },
};
</script>
