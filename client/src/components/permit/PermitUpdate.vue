<template>
  <div class="card">
    <div class="card-content">
      <h1 class="title is-4">Editando permiso</h1>
      <ValidationObserver ref="observer" v-slot="{ invalid }" tag="div" class="columns is-multiline">
        <ValidationProvider
          :rules="{ required: true, alpha_spaces: /^[a-zA-Z\s]*$/ }"
          v-slot="{ errors, valid }"
          tag="div"
          class="column is-full"
        >
          <b-field label="Título" :message="errors" :type="{ 'is-danger': errors[0], 'is-success': valid }" expanded>
            <b-input v-model="title"></b-input>
          </b-field>
        </ValidationProvider>
        <ValidationProvider
          :rules="{ required: true, alpha_spaces: /^[a-zA-Z\s]*$/, max: 100 }"
          v-slot="{ errors, valid }"
          tag="div"
          class="column is-full"
        >
          <b-field
            label="Descripción"
            :message="errors"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            expanded
          >
            <b-input v-model="description"></b-input>
          </b-field>
        </ValidationProvider>
        <ValidationProvider rules="required" v-slot="{ errors, valid }" tag="div" class="column is-half">
          <b-field label="Para el" :message="errors" :type="{ 'is-danger': errors[0], 'is-success': valid }">
            <b-datetimepicker
              v-model="outDate"
              placeholder="Fecha y hora"
              icon="calendar-today"
              position="is-top-right"
              :horizontal-time-picker="true"
              :datepicker="{
                'day-names': dayNames,
                'month-names': monthNames,
                'first-day-of-week': 1,
              }"
            >
            </b-datetimepicker>
          </b-field>
        </ValidationProvider>
        <ValidationProvider
          rules="required|numeric|max_value:5"
          v-slot="{ errors, valid }"
          tag="div"
          class="column is-half"
        >
          <b-field
            label="Cantidad de horas"
            :message="errors"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            expanded
          >
            <b-input v-model="hours"></b-input>
          </b-field>
        </ValidationProvider>
        <div class="column is-full">
          <div class="buttons is-pulled-right">
            <button class="button is-light" @click="$parent.close()">Cancelar</button>
            <button class="button is-primary" @click="update" :disabled="invalid">Continuar</button>
          </div>
        </div>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import Service from '@/services/AdisjService.js';
import { formatISO } from 'date-fns';

import { max_value, numeric, max } from 'vee-validate/dist/rules';

extend('max_value', {
  ...max_value,
  message: '¡Esas son muchas horas! Intenta con menos.',
});
extend('numeric', {
  ...numeric,
  message: 'Solo caracteres numericos.',
});
extend('max', {
  ...max,
  message: 'La descripción excede el límite.',
});

export default {
  name: 'PermitUpdate',
  props: {
    permitId: {
      type: Number,
      default: null,
    },
  },
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      title: '',
      description: '',
      outDate: null,
      hours: '',
      dayNames: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
      monthNames: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ],
    };
  },
  computed: {
    ...mapGetters('permits', ['getPermit']),
  },
  methods: {
    ...mapActions('permits', ['updatePermit']),
    update() {
      this.$buefy.dialog.confirm({
        title: `¿Actualizar permiso?`,
        message: 'Este <b>permiso</b> automáticamente pasará a tener un estado pendiente de aprobación.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        type: 'is-warning',
        hasIcon: true,
        onConfirm: async () => {
          try {
            await Service.putPermitEmployee(this.permitId, {
              titulo: this.title,
              descripcion: this.description,
              fecha_salida: formatISO(new Date(this.outDate)),
              horas: parseInt(this.hours),
            });
            this.updatePermit({
              permitId: this.permitId,
              title: this.title,
              description: this.description,
              outDate: formatISO(new Date(this.outDate)),
              hours: parseInt(this.hours),
            });
            this.$parent.close();
            this.$buefy.toast.open({
              duration: 3000,
              message: 'Permiso editato con éxito.',
              type: 'is-success',
            });
          } catch (error) {
            console.log('updatePermit -> error', error);
            this.$parent.close();
            this.$buefy.toast.open({
              duration: 3000,
              message: 'No se pudo editar este permiso.',
              type: 'is-danger',
            });
          }
        },
        onCancel: () => this.$parent.close(),
      });
    },
  },
  created() {
    this.title = this.getPermit(this.permitId).titulo;
    this.description = this.getPermit(this.permitId).descripcion;
    this.outDate = new Date(this.getPermit(this.permitId).fecha_salida);
    this.hours = this.getPermit(this.permitId).horas;
  },
};
</script>
