<template>
  <div class="personal-info">
    <h1 class="title is-4">Información personal</h1>
    <h2 class="subtitle is-6">Ingresa los datos personales del nuevo empleado</h2>
    <div class="columns">
      <div class="column">
        <ValidationProvider rules="required|dni:9" v-slot="{ errors, valid }">
          <b-field
            label="Número de cédula"
            :message="errors"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            expanded
          >
            <b-input v-model="dni" @input="sendDataToParent" maxlength="9"></b-input>
          </b-field>
        </ValidationProvider>
      </div>

      <div class="column">
        <ValidationProvider rules="required" v-slot="{ errors, valid }">
          <b-field label="Nombre" :message="errors" :type="{ 'is-danger': errors[0], 'is-success': valid }" expanded>
            <b-input v-model="name" @input="sendDataToParent"></b-input>
          </b-field>
        </ValidationProvider>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <ValidationProvider rules="required" v-slot="{ errors, valid }">
          <b-field
            label="Primer apellido"
            :message="errors"
            :type="{
              'is-danger': errors[0],
              'is-success': valid,
            }"
            expanded
          >
            <b-input v-model="fLastname" @input="sendDataToParent"></b-input>
          </b-field>
        </ValidationProvider>
      </div>

      <div class="column">
        <ValidationProvider rules="required" v-slot="{ errors, valid }">
          <b-field
            label="Segundo apellido"
            :message="errors"
            :type="{
              'is-danger': errors[0],
              'is-success': valid,
            }"
            expanded
          >
            <b-input v-model="sLastname" @input="sendDataToParent"></b-input>
          </b-field>
        </ValidationProvider>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <ValidationProvider rules="required" v-slot="{ errors }">
          <b-field label="Fecha de nacimiento" :message="errors" :type="{ 'is-danger': errors[0] }">
            <b-datepicker
              v-model="bornDate"
              :day-names="dayNames"
              :month-names="monthNames"
              :first-day-of-week="1"
              placeholder="Buscar fecha..."
              @input="sendDataToParent"
            >
            </b-datepicker>
          </b-field>
        </ValidationProvider>
      </div>
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
    };
  },
  methods: {
    sendDataToParent() {
      this.$emit('basic-data', {
        cedula: this.dni,
        nombre: this.name,
        p_apellido: this.fLastname,
        s_apellido: this.sLastname,
        fecha_nacimiento: formatISO(new Date(this.bornDate), { representation: 'date' }),
      });
    },
  },
};
</script>
