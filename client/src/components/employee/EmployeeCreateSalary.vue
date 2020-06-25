<template>
  <div class="salary-info">
    <h1 class="title is-4">Salario</h1>
    <h2 class="subtitle is-6">
      Ingresa el salario por hora y las horas por día que trabajará el nuevo empleado
    </h2>
    <div class="columns">
      <div class="column">
        <ValidationProvider :rules="{ required: true, salary: /^\d+(\.\d{1,2})?$/ }" v-slot="{ errors, valid }">
          <b-field label="Salario por hora" :message="errors" :type="{ 'is-danger': errors[0], 'is-success': valid }">
            <b-input v-model="salary" @input="sendDataToParent" placeholder="0.00"></b-input>
          </b-field>
        </ValidationProvider>
      </div>

      <div class="column">
        <ValidationProvider rules="required|numeric" v-slot="{ errors, valid }">
          <b-field
            label="Horas de trabajo por día"
            :message="errors"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            expanded
          >
            <b-input v-model="daytime" @input="sendDataToParent"></b-input>
          </b-field>
        </ValidationProvider>
      </div>
    </div>
  </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate';
// import { required, numeric, decimal } from 'vuelidate/lib/validators';

export default {
  name: 'EmployeeSalary',
  components: {
    ValidationProvider,
  },
  data() {
    return {
      salary: '',
      daytime: '',
    };
  },
  methods: {
    sendDataToParent() {
      this.$emit('salary-data', {
        salario_hora: parseInt(this.salary),
        jornada: parseInt(this.daytime),
      });
    },
  },
};
</script>
