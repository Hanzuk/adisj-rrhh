<template>
  <div class="mt-10">
    <div class="container">
      <div class="columns is-multiline">
        <div class="column is-3">
          <div class="box">
            <h5 class="title is-5">Nuevos viaticos</h5>
            <ValidationObserver ref="observer" v-slot="{ invalid, reset }" tag="div" class="columns is-multiline">
              <ValidationProvider rules="required" v-slot="{ errors }" tag="div" class="column is-full">
                <b-field label="Empleado" :message="errors" :type="{ 'is-danger': errors[0] }">
                  <b-autocomplete
                    v-model="nombre"
                    :data="filteredDataArray"
                    :open-on-focus="true"
                    dropdown-position="bottom"
                    field="nombre_completo"
                    @select="option => (selectedEmployee = option)"
                    placeholder="Buscar empleado"
                  >
                  </b-autocomplete>
                </b-field>
              </ValidationProvider>

              <ValidationProvider rules="required" v-slot="{ errors }" tag="div" class="column is-full">
                <b-field label="Motivo" :message="errors" :type="{ 'is-danger': errors[0] }" expanded>
                  <b-input v-model="reason"></b-input>
                </b-field>
              </ValidationProvider>

              <ValidationProvider rules="required" v-slot="{ errors }" tag="div" class="column is-8">
                <b-field label="Monto" :message="errors" :type="{ 'is-danger': errors[0] }" expanded>
                  <b-input
                    v-model="amount"
                    @input.native="setRawAmount"
                    placeholder="₡ 0.00"
                    v-cleave="masks.numeral"
                  ></b-input>
                </b-field>
              </ValidationProvider>

              <div class="column is-full">
                <b-button
                  type="is-primary"
                  @click="
                    nuevoViatico();
                    reset();
                  "
                  :disabled="invalid"
                  expanded
                  >Otorgar viaticos</b-button
                >
              </div>
            </ValidationObserver>
          </div>
        </div>

        <div class="column is-9">
          <div class="box">
            <h5 class="title is-5">Viaticos otorgados</h5>
            <b-table
              :data="viaticos"
              :narrowed="true"
              :paginated="true"
              :per-page="4"
              :hoverable="true"
              default-sort-direction="desc"
              default-sort="fecha"
              height="294"
            >
              <template slot-scope="props">
                <b-table-column label="Empleado" field="empleado" :searchable="true" width="200">
                  {{ props.row.empleado }}
                </b-table-column>

                <b-table-column label="Motivo" width="200">
                  {{ props.row.descripcion }}
                </b-table-column>

                <b-table-column label="Fecha" field="fecha" width="120" sortable centered>
                  <b-tag type="is-light">{{ formatDate(props.row.fecha) }}</b-tag>
                </b-table-column>
              </template>
            </b-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import Service from '@/services/AdisjService.js';
import { format } from 'date-fns';
import numeral from 'numeral';

const precision = Math.pow(10, 2);

export default {
  name: 'TravelExpAdminView',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      nombre: '',
      selectedEmployee: null,
      reason: '',
      viaticos: [],
      amount: '',
      rawAmount: 0,
      masks: {
        numeral: {
          numeral: true,
          prefix: '₡ ',
          rawValueTrimPrefix: true,
        },
      },
    };
  },
  computed: {
    ...mapGetters('employees', ['employeesForAutocomplete']),
    formatDate() {
      return date => format(new Date(date), 'dd/MM/yyyy');
    },
    formatAmount() {
      return amount => numeral(amount).format('$0,0.00');
    },
    filteredDataArray() {
      return this.employeesForAutocomplete.filter(employee => {
        return (
          employee.nombre_completo
            .toString()
            .toLowerCase()
            .indexOf(this.nombre.toLowerCase()) >= 0
        );
      });
    },
  },
  methods: {
    setRawAmount(event) {
      this.rawAmount = Math.round(event.target._vCleave.getRawValue() * precision) / precision;
    },
    async nuevoViatico() {
      try {
        await Service.postViatico(
          JSON.stringify({
            id_empleado: this.selectedEmployee.id,
            motivo: this.reason,
            monto: this.rawAmount,
          })
        );

        // const { data } = await Service.getCongrats();
        // this.congrats = data;

        this.nombre = '';
        this.amount = '';

        this.$buefy.toast.open({
          duration: 2000,
          message: 'Felicitacion registrada.',
          type: 'is-success',
        });
      } catch (error) {
        this.$buefy.toast.open({
          duration: 2000,
          message: 'No se pudo registrar la felicitacion.',
          type: 'is-danger',
        });
      }
    },
  },
  async created() {
    this.$store.dispatch('employees/fetchEmployees');
    const { data } = await Service.getCongrats();
    this.congrats = data;
  },
};
</script>
