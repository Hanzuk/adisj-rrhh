<template>
  <div>
    <Navbar />
    <div class="container">
      <div class="mt-10">
        <div class="columns is-centered">
          <div class="column ">
            <div class="card">
              <div class="card-content">
                <h5 class="title is-5">Vacaciones solicitadas</h5>
                <b-table :data="vacations" :paginated="true" :per-page="10">
                  <template slot-scope="props">
                    <b-table-column field="id" label="ID" width="40" numeric>
                      {{ props.row.id }}
                    </b-table-column>

                    <b-table-column field="nombre" label="Nombre" :searchable="true">
                      {{ props.row.nombre }}
                    </b-table-column>

                    <b-table-column field="p_apellido" label="Apellido" :searchable="true">
                      {{ props.row.p_apellido }}
                    </b-table-column>

                    <b-table-column field="p_apellido" label="Días solicitados" centered>
                      {{ props.row.cantidad }}
                    </b-table-column>

                    <b-table-column field="date" label="Fecha de salida" centered>
                      <b-tag type="is-primary">{{ formatDate(props.row.fecha_salida) }}</b-tag>
                    </b-table-column>

                    <b-table-column field="date" label="Fecha de entrada" centered>
                      <b-tag type="is-primary">{{ formatDate(props.row.fecha_entrada) }}</b-tag>
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
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Service from '@/services/AdisjService.js';
import { format } from 'date-fns';

export default {
  name: 'EmployeeList',
  components: {
    Navbar,
  },
  data() {
    return {
      vacations: [],
    };
  },
  computed: {
    formatDate() {
      return date => format(new Date(date), 'dd/MM/yyyy');
    },
  },
  async created() {
    const { data } = await Service.getVacations();
    this.vacations = data;
  },
};
</script>
