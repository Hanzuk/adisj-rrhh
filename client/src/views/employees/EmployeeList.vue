<template>
  <div class="container">
    <div class="mt-10">
      <div class="columns is-centered">
        <div class="column is-three-quarters">
          <div class="card">
            <div class="card-content">
              <h3 class="title is-3">Empleados laborando en la empresa</h3>
              <b-table :data="employees.employees" :paginated="true" :per-page="10" :mobile-cards="true">
                <template slot-scope="props">
                  <b-table-column field="id" label="ID" width="40" numeric>
                    {{ props.row.id }}
                  </b-table-column>
                  <b-table-column field="name" label="Nombre empleado">
                    {{ `${props.row.nombre} ${props.row.p_apellido} ${props.row.s_apellido}` }}
                  </b-table-column>
                  <b-table-column field="date" label="Fecha de contrato" centered>
                    <b-tag type="is-primary">{{ formatDate(props.row.fecha_contrato) }}</b-tag>
                  </b-table-column>
                  <b-table-column field="type" label="Tipo de empleado">
                    {{ props.row.tipo_empleado }}
                  </b-table-column>
                  <b-table-column field="more" label="Más información" centered>
                    <router-link
                      :to="{
                        name: 'employee-show',
                        params: { userId: props.row.id },
                      }"
                      >Ver</router-link
                    >
                  </b-table-column>
                </template>

                <template slot="empty">
                  <section class="section">
                    <div class="content has-text-grey has-text-centered">
                      <p>
                        <b-icon icon="emoticon-sad" size="is-large"> </b-icon>
                      </p>
                      <p>Nothing here.</p>
                    </div>
                  </section>
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
import { mapState } from 'vuex';
import { format } from 'date-fns';

export default {
  name: 'EmployeeList',
  computed: mapState(['employees']),
  methods: {
    formatDate(date) {
      return format(new Date(date), 'dd/MM/yyyy');
    },
  },
  created() {
    this.$store.dispatch('employees/fetchEmployees');
  },
};
</script>
