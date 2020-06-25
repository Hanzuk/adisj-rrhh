<template>
  <ValidationProvider rules="required" v-slot="{ errors }">
    <b-field label="Tipo" :message="errors" :type="{ 'is-danger': errors[0] }">
      <b-select v-model="type" @input="sendDataToParent" placeholder="Selecciona un tipo" expanded>
        <option value="1">Administrador</option>
        <option value="2">Secreatario</option>
        <option value="3">Chofer</option>
        <option value="4">Temporal</option>
      </b-select>
    </b-field>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate';

export default {
  name: 'EmployeeType',
  components: {
    ValidationProvider,
  },
  data() {
    return {
      type: null,
    };
  },
  methods: {
    sendDataToParent() {
      this.$emit('type-data', { tipo_empleado: parseInt(this.type) });
    },
  },
};
</script>
