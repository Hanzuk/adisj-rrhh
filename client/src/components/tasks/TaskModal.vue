<template>
  <div class="box">
    <h5 class="title is-4">Información para la tarea "{{ task.titulo }}"</h5>
    <b-field grouped group-multiline>
      <div class="control">
        <b-taglist attached>
          <b-tag type="is-dark">Tipo de servicio</b-tag>
          <b-tag type="is-info">{{ task.horario[0].tipo_servicio }}</b-tag>
        </b-taglist>
      </div>

      <div class="control">
        <b-taglist attached>
          <b-tag type="is-dark">Salario hora</b-tag>
          <b-tag type="is-info">{{ task.horario[0].salario_hora }}</b-tag>
        </b-taglist>
      </div>

      <div class="control">
        <b-taglist attached>
          <b-tag type="is-dark">Horas de servicio apróx</b-tag>
          <b-tag type="is-info">{{ task.horario[0].horas_servicio }}</b-tag>
        </b-taglist>
      </div>
    </b-field>

    <h5 class="is-size-5 has-text-weight-semibold ">Descripción</h5>
    <p class="mb-5">{{ task.descripcion }}</p>

    <b-field grouped group-multiline>
      <div class="control">
        <b-taglist attached>
          <b-tag type="is-dark">Chofer encargado</b-tag>
          <b-tag type="is-info">{{ task.asignada_a }}</b-tag>
        </b-taglist>
      </div>

      <div class="control">
        <b-taglist attached>
          <b-tag type="is-dark">Vehiculo asignado</b-tag>
          <b-tag type="is-info">{{ task.horario[0].vehiculo }}</b-tag>
        </b-taglist>
      </div>
    </b-field>

    <h5 class="is-size-5 has-text-weight-semibold mb-2">Días</h5>
    <b-taglist>
      <b-tag v-for="task in task.horario" :key="task.dia" type="is-info">{{ task.dia }}</b-tag>
    </b-taglist>
  </div>
</template>

<script>
import Service from '@/services/AdisjService.js';
export default {
  name: 'TaskModal',
  props: {
    taskId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      task: null,
    };
  },
  async created() {
    const { data } = await Service.getTask(this.taskId);
    this.task = data;
  },
};
</script>
