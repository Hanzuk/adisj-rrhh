<template>
  <div>
    <Navbar />
    <div class="container">
      <div class="mt-10">
        <div class="columns">
          <div class="column is-half is-offset-one-quarter">
            <div class="card">
              <div class="card-content">
                <h1 class="title is-4">Solicitar un nuevo permiso</h1>
                <ValidationObserver ref="observer" v-slot="{ invalid, reset }" tag="div" class="columns is-multiline">
                  <ValidationProvider
                    :rules="{ required: true, alpha_spaces: /^[a-zA-Z\sñáéíóú]*$/ }"
                    v-slot="{ errors, valid }"
                    tag="div"
                    class="column is-full"
                  >
                    <b-field
                      label="Título"
                      :message="errors"
                      :type="{ 'is-danger': errors[0], 'is-success': valid }"
                      expanded
                    >
                      <b-input v-model="title"></b-input>
                    </b-field>
                  </ValidationProvider>
                  <ValidationProvider
                    :rules="{ required: true, alpha_spaces: /^[a-zA-Z\sñáéíóú]*$/, max: 100 }"
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
                      label="Duración"
                      :message="errors"
                      :type="{ 'is-danger': errors[0], 'is-success': valid }"
                      expanded
                    >
                      <b-numberinput v-model="hours" min="1"></b-numberinput>
                    </b-field>
                  </ValidationProvider>
                  <div class="column is-full">
                    <button
                      class="button is-primary is-pulled-right"
                      :disabled="invalid"
                      @click="
                        requestPermit();
                        reset();
                      "
                    >
                      Solicitar
                    </button>
                  </div>
                </ValidationObserver>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
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
  name: 'PermitCreate',
  components: {
    Navbar,
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      title: '',
      description: '',
      outDate: null,
      hours: null,
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
  methods: {
    async requestPermit() {
      try {
        await Service.postPermit(
          JSON.stringify({
            titulo: this.title,
            descripcion: this.description,
            fecha_salida: formatISO(new Date(this.outDate)),
            horas: parseInt(this.hours),
          })
        );

        this.title = '';
        this.description = '';
        this.outDate = null;
        this.hours = null;

        this.$buefy.toast.open({
          duration: 3000,
          message: 'Solicitud creada con éxito.',
          type: 'is-success',
        });
      } catch (error) {
        this.$buefy.toast.open({
          duration: 3000,
          message: 'No se pudo crear esta solicitud.',
          type: 'is-danger',
        });
      }
    },
  },
};
</script>
