<template>
  <div>
    <h1 class="title is-4">Información básica</h1>
    <h2 class="subtitle is-6">Completa los datos personales del nuevo empleado</h2>
    <div class="columns">
      <ValidationProvider
        :rules="{ required: true, dni: /^[0-9]{1}-[0-9]{4}-[0-9]{4}$/ }"
        v-slot="{ errors, valid }"
        tag="div"
        class="column"
      >
        <b-field
          label="Número de cédula"
          :message="errors"
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          expanded
        >
          <b-input v-model="dni" @input="sendDataToParent" v-cleave="masks.custom" @input.native="setRawDNI"></b-input>
        </b-field>
      </ValidationProvider>

      <ValidationProvider
        :rules="{ required: true, alpha_spaces: /^[a-zA-Z\sñáéíóú]*$/ }"
        v-slot="{ errors, valid }"
        tag="div"
        class="column"
      >
        <b-field label="Nombre" :message="errors" :type="{ 'is-danger': errors[0], 'is-success': valid }" expanded>
          <b-input v-model="name" @input.native="sendDataToParent"></b-input>
        </b-field>
      </ValidationProvider>
    </div>
    <div class="columns">
      <ValidationProvider
        :rules="{ required: true, alpha_spaces: /^[a-zA-Z\sñáéíóú]*$/ }"
        v-slot="{ errors, valid }"
        tag="div"
        class="column"
      >
        <b-field
          label="Primer apellido"
          :message="errors"
          :type="{
            'is-danger': errors[0],
            'is-success': valid,
          }"
          expanded
        >
          <b-input v-model="fLastname" @input.native="sendDataToParent"></b-input>
        </b-field>
      </ValidationProvider>

      <ValidationProvider
        :rules="{ required: true, alpha_spaces: /^[a-zA-Z\sñáéíóú]*$/ }"
        v-slot="{ errors, valid }"
        tag="div"
        class="column"
      >
        <b-field
          label="Segundo apellido"
          :message="errors"
          :type="{
            'is-danger': errors[0],
            'is-success': valid,
          }"
          expanded
        >
          <b-input v-model="sLastname" @input.native="sendDataToParent"></b-input>
        </b-field>
      </ValidationProvider>
    </div>
    <div class="columns">
      <ValidationProvider rules="required" v-slot="{ errors, valid }" tag="div" class="column">
        <b-field label="Fecha de nacimiento" :message="errors" :type="{ 'is-danger': errors[0], 'is-success': valid }">
          <b-datepicker
            v-model="bornDate"
            :day-names="dayNames"
            :month-names="monthNames"
            :first-day-of-week="1"
            :max-date="new Date('2002-12-31')"
            :years-range="[-50, 100]"
            :date-formatter="date => date.toLocaleDateString('es-CR')"
            placeholder="Seleccionar fecha..."
            @input.native="sendDataToParent"
          >
          </b-datepicker>
        </b-field>
      </ValidationProvider>
    </div>
  </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate';
import { formatISO } from 'date-fns';

export default {
  name: 'EmployeeBasic',
  components: {
    ValidationProvider,
  },
  data() {
    return {
      dni: '',
      rawDNI: '',
      name: '',
      fLastname: '',
      sLastname: '',
      bornDate: null,
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
      masks: {
        custom: {
          delimiters: ['-', '-', '-'],
          blocks: [1, 4, 4],
          numericOnly: true,
          rawValueTrimPrefix: true,
        },
      },
    };
  },
  methods: {
    setRawDNI(event) {
      this.rawDNI = event.target._vCleave == undefined ? this.dni : event.target._vCleave.getRawValue();
    },
    sendDataToParent() {
      this.$emit('basic-data', {
        cedula: this.rawDNI,
        nombre: this.name,
        p_apellido: this.fLastname,
        s_apellido: this.sLastname,
        fecha_nacimiento: formatISO(new Date(this.bornDate), { representation: 'date' }),
      });
    },
  },
};
</script>
