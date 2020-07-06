<template>
  <div class="mt-10">
    <div class="container">
      <div class="columns is-multiline">
        <div class="column is-3">
          <div class="box">
            <h5 class="title is-5">Nueva retención salarial</h5>
            <ValidationObserver ref="observer" v-slot="{ invalid }" tag="div" class="columns is-multiline">
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
                <b-field label="Monto a retener" :message="errors" :type="{ 'is-danger': errors[0] }" expanded>
                  <b-input
                    v-model="amount"
                    @input.native="setRawAmount"
                    placeholder="₡ 0.00"
                    v-cleave="masks.numeral"
                  ></b-input>
                </b-field>
              </ValidationProvider>

              <div class="column is-full">
                <b-button type="is-primary" @click="applyRetention" :disabled="invalid" expanded
                  >Aplicar retención</b-button
                >
              </div>
            </ValidationObserver>
            {{ selectedEmployee }}
          </div>
        </div>

        <div class="column is-9">
          <div class="box">
            <h5 class="title is-5">Retenciones aplicadas</h5>
            <b-table
              :data="retentions"
              :narrowed="true"
              :paginated="true"
              :per-page="4"
              :bordered="true"
              default-sort-direction="desc"
              default-sort="fecha"
              height="294"
            >
              <template slot-scope="props">
                <b-table-column label="Empleado" field="nombre" :searchable="true" width="170">
                  {{ props.row.nombre }}
                </b-table-column>

                <b-table-column label="Apellido" field="p_apellido" :searchable="true" width="150">
                  {{ props.row.p_apellido }}
                </b-table-column>

                <b-table-column label="Monto" centered>
                  {{ formatAmount(props.row.retencion) }}
                </b-table-column>

                <b-table-column label="Motivo">
                  {{ props.row.descripcion }}
                </b-table-column>

                <b-table-column label="Fecha" field="fecha" sortable centered>
                  <span class="tag is-success">
                    {{ new Date(props.row.fecha).toLocaleDateString() }}
                  </span>
                </b-table-column>
                <b-table-column label="Acciones" centered>
                  <b-button @click="removeRetention(props.row.id)" type="is-danger" icon-right="delete" />
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
      reason: '',
      retentions: [],
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
    async applyRetention() {
      try {
        await Service.postRetention(
          JSON.stringify({
            id: this.selectedEmployee.id,
            amount: this.rawAmount,
            reason: this.reason,
          })
        );
        const { data } = await Service.getRetentions();
        this.retentions = data;
        this.$buefy.toast.open({
          duration: 2000,
          message: 'Retencion aplicada.',
          type: 'is-success',
        });
      } catch (error) {
        this.$buefy.toast.open({
          duration: 2000,
          message: 'No se pudo aplicar la retencion.',
          type: 'is-danger',
        });
      }
    },
    async removeRetention(id) {
      try {
        await Service.deleteRetention(id);
        const { data } = await Service.getRetentions();
        this.retentions = data;
        this.$buefy.toast.open({
          duration: 2000,
          message: 'Retencion eliminada.',
          type: 'is-success',
        });
      } catch (error) {
        this.$buefy.toast.open({
          duration: 2000,
          message: 'No se pudo eliminar la retencion.',
          type: 'is-danger',
        });
      }
    },
  },
  async created() {
    this.$store.dispatch('employees/fetchEmployees');
    const { data } = await Service.getRetentions();
    this.retentions = data;
  },
};
</script>
