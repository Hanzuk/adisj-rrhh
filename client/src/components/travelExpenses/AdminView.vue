<template>
  <div class="mt-10">
    <div class="container">
      <div class="columns is-multiline">
        <div class="column is-3">
          <div class="box">
            <h5 class="title is-5">Nuevos viáticos</h5>
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

              <ValidationProvider
                :rules="{ required: true, alpha_spaces: /^[a-zA-Z .,]*$/ }"
                v-slot="{ errors }"
                tag="div"
                class="column is-full"
              >
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
                  >Otorgar viáticos</b-button
                >
              </div>
            </ValidationObserver>
          </div>
        </div>

        <div class="column is-9">
          <div class="box">
            <h5 class="title is-5">Viáticos otorgados</h5>
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
                <b-table-column label="Empleado" field="nombre" :searchable="true">
                  {{ props.row.nombre }}
                </b-table-column>

                <b-table-column label="Apellido" field="p_apellido" :searchable="true">
                  {{ props.row.p_apellido }}
                </b-table-column>

                <b-table-column label="Monto">
                  <b-tag type="is-success">{{ formatAmount(props.row.monto) }}</b-tag>
                </b-table-column>

                <b-table-column label="Motivo" width="350">
                  {{ props.row.motivo }}
                </b-table-column>

                <b-table-column label="Fecha" field="fecha" width="120" sortable centered>
                  <b-tag type="is-light">{{ formatDate(props.row.fecha) }}</b-tag>
                </b-table-column>

                <b-table-column label="Eliminar" centered>
                  <b-button type="is-danger" icon-right="delete" @click="borrar(props.row.id)" />
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

        const { data } = await Service.getViaticos();
        this.viaticos = data;

        this.nombre = '';
        this.reason = '';
        this.amount = '';

        this.$buefy.toast.open({
          duration: 2500,
          message: 'Viáticos otorgados con exito.',
          type: 'is-success',
        });
      } catch (error) {
        this.$buefy.toast.open({
          duration: 2500,
          message: 'No se pudo otorgar los viaticos.',
          type: 'is-danger',
        });
      }
    },
    async borrar(id) {
      try {
        await Service.deleteViaticos(id);

        this.$buefy.toast.open({
          duration: 2500,
          message: 'Viaticos eliminados con exito.',
          type: 'is-success',
        });

        const { data } = await Service.getViaticos();
        this.viaticos = data;
      } catch (error) {
        this.$buefy.toast.open({
          duration: 2500,
          message: 'No se pudo eliminar los viaticos.',
          type: 'is-danger',
        });
      }
    },
  },
  async created() {
    this.$store.dispatch('employees/fetchEmployees');
    const { data } = await Service.getViaticos();
    this.viaticos = data;
  },
};
</script>
