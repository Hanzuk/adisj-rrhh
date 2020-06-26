<template>
  <div>
    <h1 class="title is-4">Laboral</h1>
    <h2 class="subtitle is-6">
      Completa los siguientes datos básicos importantes para la empresa
    </h2>
    <div class="columns">
      <ValidationProvider rules="required" v-slot="{ errors }" tag="div" class="column">
        <b-field label="Tipo de empleado" :message="errors" :type="{ 'is-danger': errors[0] }">
          <b-select v-model="employeeType" @input="sendDataToParent" placeholder="Selecciona un tipo" expanded>
            <option value="1">Administrador</option>
            <option value="2">Secreatario</option>
            <option value="3">Chofer</option>
            <option value="4">Temporal</option>
          </b-select>
        </b-field>
      </ValidationProvider>
    </div>
    <div class="columns">
      <ValidationProvider
        :rules="{ required: true, salary: /^₡\s{1}[0-9]{1,3}(,[0-9]{3})*(\.\d{1,2})?$/ }"
        v-slot="{ errors, valid }"
        tag="div"
        class="column"
      >
        <b-field
          label="Salario por hora"
          :message="errors"
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          expanded
        >
          <b-input
            v-model="salary"
            @input="sendDataToParent"
            @input.native="setRawSalary"
            placeholder="0.00"
            v-cleave="masks.numeral"
          ></b-input>
        </b-field>
      </ValidationProvider>

      <ValidationProvider rules="required|numeric" v-slot="{ errors, valid }" tag="div" class="column">
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
    <div class="columns" v-if="employeeType == 4">
      <ValidationProvider rules="required" v-slot="{ errors, valid }" tag="div" class="column">
        <b-field
          label="Contratado para"
          :message="errors"
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          expanded
        >
          <b-input v-model="description" @input="sendDataToParent"></b-input>
        </b-field>
      </ValidationProvider>
      <ValidationProvider rules="required" v-slot="{ errors, valid }" tag="div" class="column">
        <b-field
          label="Expiración del contrato"
          :message="errors"
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
        >
          <b-datepicker
            v-model="outDate"
            :day-names="dayNames"
            :month-names="monthNames"
            :first-day-of-week="1"
            placeholder="Seleccionar fecha..."
            @input="sendDataToParent"
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

const precision = Math.pow(10, 2);

export default {
  name: 'EmployeeSalary',
  components: {
    ValidationProvider,
  },
  data() {
    return {
      employeeType: null,
      salary: '',
      rawSalary: 0,
      daytime: '',
      description: '',
      outDate: null,
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
        numeral: {
          numeral: true,
          prefix: '₡ ',
          rawValueTrimPrefix: true,
        },
      },
    };
  },
  methods: {
    setRawSalary(event) {
      this.rawSalary = Math.round(event.target._vCleave.getRawValue() * precision) / precision;
    },
    sendDataToParent() {
      this.$emit('labour-data', {
        tipo_empleado: parseInt(this.employeeType),
        salario_hora: this.rawSalary,
        jornada: parseInt(this.daytime),
        fecha_salida: formatISO(new Date(this.outDate), { representation: 'date' }),
        descripcion: this.description,
      });
    },
  },
};
</script>
