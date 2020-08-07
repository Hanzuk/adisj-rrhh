<template>
  <div>
    <Navbar />
    <div class="mt-10">
      <div class="container">
        <div class="columns is-multiline">
          <div class="column is-one-third">
            <div class="box">
              <h5 class="title is-5">Nueva incapacidad</h5>
              <ValidationObserver ref="observer" v-slot="{ invalid, reset }" tag="div" class="columns is-multiline">
                <ValidationProvider rules="required" v-slot="{ errors }" tag="div" class="column is-full">
                  <b-field label="Empleado" :message="errors" :type="{ 'is-danger': errors[0] }">
                    <b-autocomplete
                      v-model="name"
                      :data="filteredEmployees"
                      :open-on-focus="true"
                      dropdown-position="bottom"
                      field="nombre_completo"
                      @select="option => (selectedEmployee = option)"
                      placeholder="Buscar empleado"
                    >
                    </b-autocomplete>
                  </b-field>
                </ValidationProvider>

                <ValidationProvider rules="required" tag="div" class="column is-full">
                  <b-field label="Días incapacitado">
                    <b-datepicker
                      v-model="dates"
                      :day-names="dayNames"
                      :month-names="monthNames"
                      size="is-small"
                      range
                      inline
                    >
                    </b-datepicker>
                  </b-field>
                </ValidationProvider>

                <ValidationProvider rules="required" v-slot="{ errors, valid }" tag="div" class="column is-full">
                  <b-field label="Motivo" :message="errors" :type="{ 'is-danger': errors[0], 'is-success': valid }">
                    <b-input v-model="reason"></b-input>
                  </b-field>
                </ValidationProvider>

                <div class="column is-full">
                  <b-button
                    type="is-primary"
                    @click="
                      newHandicap();
                      reset();
                    "
                    :disabled="invalid"
                    expanded
                    >Confimar</b-button
                  >
                </div>
              </ValidationObserver>
            </div>
          </div>

          <div class="column is-8">
            <div class="box">
              <h5 class="title is-5">Incapacidades registradas</h5>
              <b-table
                :data="handicaps"
                :narrowed="true"
                :paginated="true"
                :per-page="6"
                :hoverable="true"
                default-sort-direction="desc"
                default-sort="id"
                height="294"
              >
                <template slot-scope="props">
                  <b-table-column label="ID" field="id" sortable :visible="false">
                    {{ props.row.id }}
                  </b-table-column>

                  <b-table-column label="Empleado" field="nombre" :searchable="true" width="200">
                    {{ props.row.nombre }}
                  </b-table-column>

                  <b-table-column label="Apellido" field="p_apellido" :searchable="true" width="200">
                    {{ props.row.p_apellido }}
                  </b-table-column>

                  <b-table-column label="Motivo" width="200">
                    {{ props.row.motivo }}
                  </b-table-column>

                  <b-table-column label="Salida" width="110" centered>
                    <b-tag type="is-success">{{ formatDate(props.row.fecha_salida) }}</b-tag>
                  </b-table-column>

                  <b-table-column label="Entrada" width="110" centered>
                    <b-tag type="is-danger">{{ formatDate(props.row.fecha_entrada) }}</b-tag>
                  </b-table-column>
                </template>
              </b-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { mapGetters } from 'vuex';
import Service from '@/services/AdisjService.js';
import { format, differenceInDays } from 'date-fns';

export default {
  name: 'Handicaps',
  components: {
    Navbar,
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      name: '',
      selectedEmployee: null,
      dates: [],
      reason: '',
      handicaps: [],
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
  computed: {
    ...mapGetters('employees', ['employeesForAutocomplete']),
    filteredEmployees() {
      return this.employeesForAutocomplete.filter(employee => {
        return (
          employee.nombre_completo
            .toString()
            .toLowerCase()
            .indexOf(this.name.toLowerCase()) >= 0
        );
      });
    },
    formatDate() {
      return date => format(new Date(date), 'dd/MM/yyyy');
    },
  },
  methods: {
    async newHandicap() {
      try {
        await Service.postHandicap(
          JSON.stringify({
            id_empleado: this.selectedEmployee.id,
            fecha_salida: format(new Date(this.dates[0]), 'yyyy-MM-dd'),
            fecha_entrada: format(new Date(this.dates[1]), 'yyyy-MM-dd'),
            motivo: this.reason,
            cantidad: differenceInDays(new Date(this.dates[1]), new Date(this.dates[0])),
          })
        );

        const { data } = await Service.getHandicaps();
        this.handicaps = data;
        this.reason = '';
        this.dates = [];

        this.$buefy.toast.open({
          duration: 2500,
          message: 'Incapacidad registrada',
          type: 'is-success',
        });
      } catch (error) {
        this.$buefy.toast.open({
          duration: 2500,
          message: 'No se pudo registrar la incapacidad',
          type: 'is-danger',
        });
      }
    },
  },
  async created() {
    this.$store.dispatch('employees/fetchEmployees');
    const { data } = await Service.getHandicaps();
    this.handicaps = data;
  },
};
</script>
