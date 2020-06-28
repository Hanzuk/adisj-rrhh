<template>
  <div class="card employee-update">
    {{ salary }} | {{ rawSalary }} | {{ daytime }} | {{ email }} | {{ employeeType }}
    <header class="card-header">
      <p class="card-header-title">Actualizando información de {{ fullname }}</p>
    </header>
    <div class="card-content">
      <div class="columns is-multiline">
        <ValidationProvider
          :rules="{ required: true, myEmail: myEmailRegex }"
          v-slot="{ errors, valid }"
          tag="div"
          class="column is-half"
        >
          <b-field label="Correo electrónico" :message="errors" :type="{ 'is-danger': errors[0], 'is-success': valid }">
            <b-input v-model="email" value="asddasd"></b-input>
          </b-field>
        </ValidationProvider>

        <ValidationProvider rules="required|numeric" v-slot="{ errors, valid }" tag="div" class="column is-half">
          <b-field
            label="Horas de trabajo por día"
            :message="errors"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            expanded
          >
            <b-input v-model="daytime"></b-input>
          </b-field>
        </ValidationProvider>

        <ValidationProvider
          :rules="{ required: true, salary: /^₡\s{1}[0-9]{1,3}(,[0-9]{3})*(\.\d{1,2})?$/ }"
          v-slot="{ errors, valid }"
          tag="div"
          class="column is-half"
        >
          <b-field
            label="Salario por hora"
            :message="errors"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            expanded
          >
            <b-input
              v-model="salary"
              @input.native="setRawSalary"
              placeholder="0.00"
              v-cleave="masks.numeral"
            ></b-input>
          </b-field>
        </ValidationProvider>

        <ValidationProvider rules="required" v-slot="{ errors }" tag="div" class="column is-half">
          <b-field label="Tipo de empleado" :message="errors" :type="{ 'is-danger': errors[0] }">
            <b-select v-model="employeeType" placeholder="Selecciona un tipo" expanded>
              <option value="1">Administrador</option>
              <option value="2">Secreatario</option>
              <option value="3">Chofer</option>
              <option value="4">Temporal</option>
            </b-select>
          </b-field>
        </ValidationProvider>

        <div class="column is-full">
          <b-switch v-model="changePassword">
            Cambiar contraseña
          </b-switch>
        </div>

        <ValidationProvider
          :rules="{ required: true, password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{10,}$/ }"
          vid="password"
          v-slot="{ errors, valid }"
          tag="div"
          class="column is-half"
          v-if="changePassword"
        >
          <b-field label="Nueva contraseña" :message="errors" :type="{ 'is-danger': errors[0], 'is-success': valid }">
            <b-input v-model="password"></b-input>
          </b-field>
        </ValidationProvider>

        <ValidationProvider
          rules="required|passConfirmed:password"
          v-slot="{ errors, valid }"
          tag="div"
          class="column is-half"
          v-if="changePassword"
        >
          <b-field
            label="Confirmar contraseña"
            :message="errors"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
          >
            <b-input v-model="repeatPassword"></b-input>
          </b-field>
        </ValidationProvider>

        <div class="column is-full">
          <div class="buttons is-pulled-right">
            <button class="button is-light">Cancelar</button>
            <button class="button is-primary">Confirmar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate';
import { mapState, mapGetters } from 'vuex';
import numeral from 'numeral';
numeral.locale('cr');

const precision = Math.pow(10, 2);

export default {
  name: 'EmployeeUpdate',
  components: { ValidationProvider },
  computed: {
    ...mapState({
      employee: state => state.employees.employee,
    }),
    ...mapGetters('employees', ['fullname']),
  },
  data() {
    return {
      email: '',
      daytime: '',
      salary: '',
      rawSalary: 0,
      employeeType: null,
      changePassword: false,
      password: '',
      repeatPassword: '',
      masks: {
        numeral: {
          numeral: true,
          prefix: '₡ ',
          rawValueTrimPrefix: true,
        },
      },
      myEmailRegex: /^(([^<>()[\]\\.,;:!#$%^&+*\s@"]+(\.[^<>()\\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    };
  },
  created() {
    this.email = this.employee.correo;
    this.daytime = this.employee.jornada;
    this.salary = numeral(this.employee.salario_hora).format('$0,0.00');
    this.rawSalary = this.employee.salario_hora;
    this.employeeType = this.employee.tipo_empleado;
  },
  methods: {
    setRawSalary(event) {
      this.rawSalary = Math.round(event.target._vCleave.getRawValue() * precision) / precision;
    },
  },
};
</script>
