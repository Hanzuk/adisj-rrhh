<template>
  <div class="card employee-update">
    <header class="card-header">
      <p class="card-header-title">Re-contratando a {{ fullname }}</p>
    </header>
    <div class="card-content">
      <ValidationObserver ref="observer" v-slot="{ invalid }" tag="div" class="columns is-multiline">
        <ValidationProvider rules="required" v-slot="{ errors }" tag="div" class="column is-full">
          <b-field label="Expiración del contrato" :message="errors" :type="{ 'is-danger': errors[0] }">
            <b-datepicker
              v-model="outDate"
              :day-names="dayNames"
              :month-names="monthNames"
              :first-day-of-week="1"
              :date-formatter="date => date.toLocaleDateString('es-CR')"
              placeholder="Seleccionar fecha..."
              position="is-bottom-left"
              inline
            >
            </b-datepicker>
          </b-field>
        </ValidationProvider>

        <ValidationProvider rules="required" v-slot="{ errors, valid }" tag="div" class="column is-full">
          <b-field label="Motivo" :message="errors" :type="{ 'is-danger': errors[0], 'is-success': valid }" expanded>
            <b-input v-model="description"></b-input>
          </b-field>
        </ValidationProvider>

        <div class="column is-full">
          <div class="buttons is-pulled-right">
            <button class="button is-light" @click="$parent.close()">Cancelar</button>
            <button class="button is-primary" @click="rehire" :disabled="invalid">Confirmar</button>
          </div>
        </div>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { mapState, mapGetters } from 'vuex';
import Service from '@/services/AdisjService.js';
import { formatISO } from 'date-fns';

export default {
  name: 'EmployeeRehire',
  components: { ValidationProvider, ValidationObserver },
  computed: {
    ...mapState({
      employee: state => state.employees.employee,
    }),
    ...mapGetters('employees', ['fullname']),
  },
  data() {
    return {
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
    };
  },
  methods: {
    async rehire() {
      try {
        this.$parent.close();
        await Service.rehire(
          this.$route.params.userId,
          JSON.stringify({
            fecha_salida: formatISO(new Date(this.outDate), { representation: 'date' }),
            descripcion: this.description,
          })
        );

        this.$buefy.toast.open({
          duration: 3000,
          message: 'Empleado re-contratado.',
          type: 'is-success',
        });
      } catch (error) {
        this.$buefy.toast.open({
          duration: 3000,
          message: 'No se pudo re-contratar al empleado.',
          type: 'is-danger',
        });
      }
    },
  },
};
</script>
