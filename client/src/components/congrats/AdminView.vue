<template>
  <div class="mt-10">
    <div class="container">
      <div class="columns is-multiline">
        <div class="column is-3">
          <div class="box">
            <h5 class="title is-5">Nueva felicitación</h5>
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
                :rules="{ required: true, alpha_spaces: /^[a-zA-Z0-9 .,]*$/ }"
                v-slot="{ errors }"
                tag="div"
                class="column is-full"
              >
                <b-field label="Motivo" :message="errors" :type="{ 'is-danger': errors[0] }" expanded>
                  <b-input v-model="reason"></b-input>
                </b-field>
              </ValidationProvider>

              <div class="column is-full">
                <b-button
                  type="is-primary"
                  @click="
                    applyCongrat();
                    reset();
                  "
                  :disabled="invalid"
                  expanded
                  >Aplicar felicitación</b-button
                >
              </div>
            </ValidationObserver>
          </div>
        </div>

        <div class="column is-9">
          <div class="box">
            <h5 class="title is-5">Felicitaciones aplicadas</h5>
            <b-table
              :data="congrats"
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
      reason: '',
      congrats: [],
    };
  },
  computed: {
    ...mapGetters('employees', ['employeesForAutocomplete']),
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
    async applyCongrat() {
      try {
        await Service.postCongrat(
          JSON.stringify({
            id_empleado: this.selectedEmployee.id,
            descripcion: this.reason,
          })
        );

        const { data } = await Service.getCongrats();
        this.congrats = data;

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
