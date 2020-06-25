<template>
  <div class="container">
    <Navbar />
    <div class="columns is-centered">
      <div class="column is-two-fifths">
        <h3 class="title is-3">Información del empleado</h3>
        <div class="basic-info">
          <h1 class="title is-4">Básica</h1>
          <b-field grouped>
            <b-field label="Número de cédula" expanded>
              <p>{{ employee.cedula }}</p>
            </b-field>
            <b-field label="Nombre completo" expanded>
              <p>{{ fullname }}</p>
            </b-field>
          </b-field>
          <b-field label="Fecha de nacimiento">
            <p>{{ bornDate }}</p>
          </b-field>
        </div>
        <div class="contact-info">
          <h1 class="title is-4">Contacto</h1>
          <b-field label="Correo electrónico" expanded>
            <div class="flex">
              <b-icon icon="email"></b-icon>
              <span class="ml-2">{{ employee.correo }}</span>
            </div>
          </b-field>
          <b-field label="Números de teléfono"></b-field>
          <b-field v-for="phone in employee.telefonos" :key="phone.id" expanded>
            <b-icon :icon="phone.tipo_telefono === 'Celular' ? 'cellphone-iphone' : 'phone-classic'"></b-icon>
            <span class="ml-2">{{ formatPhone(phone.numero) }}</span>
          </b-field>
          <b-field grouped>
            <b-field label="Provincia" expanded>
              <p>
                {{ employee.direccion.provincia }}
              </p>
            </b-field>
            <b-field label="Cantón" expanded>
              <p>{{ employee.direccion.canton }}</p>
            </b-field>
            <b-field label="Distrito" expanded>
              <p>{{ employee.direccion.distrito }}</p>
            </b-field>
          </b-field>
          <b-field label="Dirección exacta" expanded>
            <p>{{ employee.direccion.direccion }}</p>
          </b-field>
        </div>
        <div class="work-info">
          <h1 class="title is-4">Laboral</h1>
          <b-field grouped>
            <b-field label="Contratado el" expanded>
              <b-taglist attached>
                <b-tag type="is-dark">{{ contractDate }}</b-tag>
                <b-tag type="is-info">Hace {{ contractAgo }}</b-tag>
              </b-taglist>
            </b-field>
            <b-field label="Salario por hora" expanded>
              <p>{{ salary }}</p>
            </b-field>
            <b-field label="Jornada" expanded>
              <p>{{ employee.jornada }}</p>
            </b-field>
            <b-field label="Tipo de empleado" expanded>
              <p>{{ employee.tipo_empleado }}</p>
            </b-field>
          </b-field>
        </div>
        <b-field position="is-right" grouped>
          <div class="control">
            <button class="button is-primary">
              Editar
            </button>
          </div>
          <div class="control">
            <button class="button is-danger" @click="fire">
              Despedir
            </button>
          </div>
        </b-field>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import { mapState, mapGetters } from 'vuex';
import store from '@/store';
import { format, formatDistanceToNow } from 'date-fns';
import es from 'date-fns/locale/es';
import numeral from 'numeral';

numeral.register('locale', 'cr', {
  delimiters: {
    thousands: '.',
    decimal: ',',
  },
  abbreviations: {
    thousand: 'k',
    million: 'm',
    billion: 'b',
    trillion: 't',
  },
  ordinal: function(number) {
    return number === 1 ? 'er' : 'ème';
  },
  currency: {
    symbol: '₡',
  },
});

export default {
  name: 'EmployeeShow',
  components: {
    Navbar,
  },
  props: ['userId'],
  async beforeRouteEnter(to, from, next) {
    await store.dispatch('employees/fetchEmployee', to.params.userId);
    next();
  },
  computed: {
    ...mapState({
      employee: state => state.employees.employee,
    }),
    ...mapGetters('employees', ['fullname']),
    bornDate() {
      return format(new Date(this.employee.fecha_nacimiento), 'dd/MM/yyyy');
    },
    contractDate() {
      return format(new Date(this.employee.fecha_contrato), 'dd/MM/yyyy');
    },
    contractAgo() {
      return formatDistanceToNow(new Date(this.employee.fecha_contrato), {
        locale: es,
      });
    },
    salary() {
      numeral.locale('cr');
      return numeral(this.employee.salario_hora).format('$0,0.00');
    },
  },
  methods: {
    formatPhone(phone) {
      return phone.substr(0, 4) + '-' + phone.substr(4, 7);
    },
    fire() {
      this.$buefy.dialog.confirm({
        title: 'Despedir empleado',
        message: '¿Seguro que quieres <b>despedir</b> a este empleado? Esta acción no se puede revertir.',
        confirmText: 'Despedir',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.$buefy.toast.open('¡Empleado despedido!'),
      });
    },
  },
};
</script>
