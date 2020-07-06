<template>
  <div class="mt-10">
    <div class="container">
      <div class="columns is-multiline">
        <div class="column is-3">
          <div class="box">
            <h5 class="title is-5">Nuevo aumento salarial</h5>
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
                    applyIncrease();
                    reset();
                  "
                  :disabled="invalid"
                  expanded
                  >Aplicar aumento</b-button
                >
              </div>
            </ValidationObserver>
          </div>
        </div>

        <div class="column is-9">
          <div class="box">
            <h5 class="title is-5">Aumentos salariales aplicados</h5>
            <b-table
              :data="increases"
              :narrowed="true"
              :paginated="true"
              :per-page="4"
              :hoverable="true"
              default-sort-direction="desc"
              default-sort="fecha"
              height="294"
            >
              <template slot-scope="props">
                <b-table-column label="Empleado" field="nombre" :searchable="true" width="200">
                  {{ props.row.nombre }}
                </b-table-column>

                <b-table-column label="Apellido" field="p_apellido" :searchable="true" width="200">
                  {{ props.row.p_apellido }}
                </b-table-column>

                <b-table-column label="Monto" width="200">
                  <b-tag type="is-success">{{ formatAmount(props.row.cantidad) }}</b-tag>
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
import numeral from 'numeral';
import { format } from 'date-fns';

const precision = Math.pow(10, 2);

export default {
  name: 'Withholding',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      nombre: '',
      selectedEmployee: null,
      amount: '',
      rawAmount: 0,
      increases: [],
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
    formatAmount() {
      return amount => numeral(amount).format('+$0,0.00');
    },
    formatDate() {
      return date => format(new Date(date), 'dd/MM/yyyy');
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
    async applyIncrease() {
      try {
        await Service.addIncrease(
          this.selectedEmployee.id,
          JSON.stringify({
            cantidad: this.rawAmount,
          })
        );

        const { data } = await Service.getIncreases();
        this.increases = data;
        this.nombre = '';
        this.amount = '';

        this.$buefy.toast.open({
          duration: 2000,
          message: 'Aumento aplicado.',
          type: 'is-success',
        });
      } catch (error) {
        this.$buefy.toast.open({
          duration: 2000,
          message: 'No se pudo aplicar el aumento.',
          type: 'is-danger',
        });
      }
    },
  },
  async created() {
    this.$store.dispatch('employees/fetchEmployees');
    const { data } = await Service.getIncreases();
    this.increases = data;
  },
};
</script>
