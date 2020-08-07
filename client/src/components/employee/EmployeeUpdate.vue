<template>
  <div class="card employee-update">
    <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
    <header class="card-header">
      <p class="card-header-title">Actualizando información de {{ fullname }}</p>
    </header>
    <div class="card-content">
      <ValidationObserver ref="observer" v-slot="{ invalid }" tag="div" class="columns is-multiline">
        <ValidationProvider
          :rules="{ required: true, myEmail: /^\S[a-z0-9\_\-\.]+@[a-z]+(\.\w{2,3}|\.\w{2,3}\.\w{2,3})$/ }"
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

        <ValidationProvider
          rules="required"
          v-slot="{ errors, valid }"
          tag="div"
          class="column is-half"
          v-if="employeeType == 4"
        >
          <b-field
            label="Contratado para"
            :message="errors"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            expanded
          >
            <b-input v-model="description"></b-input>
          </b-field>
        </ValidationProvider>

        <ValidationProvider
          rules="required"
          v-slot="{ errors }"
          tag="div"
          class="column is-half"
          v-if="employeeType == 4"
        >
          <b-field label="Expiración del contrato" :message="errors" :type="{ 'is-danger': errors[0] }">
            <b-datepicker
              v-model="outDate"
              :day-names="dayNames"
              :month-names="monthNames"
              :first-day-of-week="1"
              :date-formatter="date => date.toLocaleDateString('es-CR')"
              placeholder="Seleccionar fecha..."
              position="is-bottom-left"
            >
            </b-datepicker>
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
            <button class="button is-light" @click="$parent.close()">Cancelar</button>
            <button class="button is-primary" @click="updateInfo" :disabled="invalid">
              Confirmar
            </button>
          </div>
        </div>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { mapState, mapGetters } from 'vuex';
import numeral from 'numeral';
numeral.locale('cr');
import Service from '@/services/AdisjService.js';
import { formatISO } from 'date-fns';

const precision = Math.pow(10, 2);

export default {
  name: 'EmployeeUpdate',
  components: { ValidationProvider, ValidationObserver },
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
      outDate: null,
      description: '',
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
      isLoading: false,
    };
  },
  created() {
    this.email = this.employee.correo;
    this.daytime = this.employee.jornada;
    this.salary = numeral(this.employee.salario_hora).format('$0,0.00');
    this.rawSalary = this.employee.salario_hora;
    this.employeeType = this.employee.tipo_empleado;
    this.description = this.employee.info_contrato.actual.descripcion;
    this.outDate = new Date(this.employee.info_contrato.actual.fecha_salida);
  },
  methods: {
    setRawSalary(event) {
      this.rawSalary = Math.round(event.target._vCleave.getRawValue() * precision) / precision;
    },
    async updateInfo() {
      this.isLoading = true;
      const currentMail = this.email;

      try {
        await Service.putEmployee(
          this.$route.params.userId,
          JSON.stringify({
            correo: this.email,
            jornada: parseInt(this.daytime),
            salario_hora: this.rawSalary,
            tipo_empleado: parseInt(this.employeeType),
            fecha_salida: formatISO(new Date(this.outDate), { representation: 'date' }),
            descripcion: this.description,
            clave: this.password != '' ? this.password : undefined,
          })
        );

        if (this.password != '') {
          await Service.sendNewCredentials(
            JSON.stringify({
              to: this.email,
              name: this.employee.nombre,
              email: this.email,
              password: this.password,
            })
          );

          this.isLoading = false;
          this.$parent.close();

          this.$buefy.toast.open({
            duration: 2500,
            message: 'Información actualizada.',
            type: 'is-success',
          });

          return;
        }

        if (currentMail != this.email) {
          await Service.sendNewUsername(
            JSON.stringify({
              to: this.email,
              name: this.employee.nombre,
              email: this.email,
            })
          );
        }

        this.isLoading = false;
        this.$parent.close();

        this.$buefy.toast.open({
          duration: 2500,
          message: 'Información actualizada.',
          type: 'is-success',
        });
      } catch (error) {
        this.isLoading = false;

        this.$buefy.toast.open({
          duration: 2500,
          message: 'No se pudo actualizar la información.',
          type: 'is-danger',
        });

        console.log(error);
      }
    },
  },
};
</script>
