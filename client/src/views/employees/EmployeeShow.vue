<template>
  <div class="container">
    <div class="mt-10">
      <div class="columns">
        <div class="column">
          <h3 class="title is-3">Información del empleado</h3>
        </div>

        <div class="column">
          <b-field position="is-right" grouped>
            <div class="control">
              <button class="button is-primary" @click="openUpdateModal">
                Editar
              </button>
            </div>
            <div class="control">
              <button class="button is-danger" @click="openFireModal">
                Despedir
              </button>
            </div>
          </b-field>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <div class="card">
            <div class="card-content">
              <div class="columns is-multiline">
                <div class="column is-full">
                  <h1 class="title is-4">Básica</h1>
                  <b-field grouped>
                    <b-field label="Número de cédula" expanded>
                      <div class="flex">
                        <b-icon icon="card-account-details"></b-icon>
                        <span class="ml-2">{{ dniFormatted }}</span>
                      </div>
                    </b-field>
                    <b-field label="Nombre completo" expanded>
                      <p>{{ fullname }}</p>
                    </b-field>
                  </b-field>

                  <b-field label="Fecha de nacimiento" expanded>
                    <div class="flex">
                      <b-icon icon="cake-variant"></b-icon>
                      <span class="ml-2">{{ bornDate }}</span>
                    </div>
                  </b-field>
                </div>

                <div class="column is-full">
                  <h1 class="title is-4">Contacto</h1>
                  <b-field expanded>
                    <template slot="label">
                      Correo electrónico
                      <b-tooltip type="is-dark" label="Editable">
                        <b-icon size="is-small" icon="pencil"></b-icon>
                      </b-tooltip>
                    </template>
                    <div class="flex items-center">
                      <b-icon icon="email"></b-icon>
                      <!-- <ion-icon name="mail"></ion-icon> -->
                      <span class="ml-2">{{ employee.correo }}</span>
                    </div>
                  </b-field>
                  <b-field label="Números de teléfono"></b-field>
                  <b-field v-for="phone in employee.telefonos" :key="phone.id" expanded>
                    <b-icon :icon="phone.tipo_telefono === 'Celular' ? 'cellphone-iphone' : 'phone-classic'"></b-icon>
                    <span class="ml-2">{{ formatPhone(phone.numero) }}</span>
                  </b-field>

                  <b-field label="Residiendo en" expanded>
                    <div class="flex">
                      <div class="mr-2"><b-icon icon="map-marker"></b-icon></div>
                      <div>
                        <p>
                          {{ employee.direccion.distrito }}, {{ employee.direccion.canton }},
                          {{ employee.direccion.provincia }}
                        </p>
                        <p>{{ employee.direccion.direccion }}</p>
                      </div>
                    </div>
                  </b-field>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="column">
          <div class="card">
            <div class="card-content">
              <h1 class="title is-4">Laboral</h1>
              <div class="columns">
                <div class="column">
                  <b-field label="Contratado" expanded>
                    <b-taglist attached>
                      <b-tag type="is-light">{{ contractDate }}</b-tag>
                      <b-tag type="is-primary">Hace {{ contractAgo }}</b-tag>
                    </b-taglist>
                  </b-field>
                </div>
                <div class="column" v-if="employee.info_contrato">
                  <b-field label="Finaliza" expanded>
                    <b-taglist attached>
                      <b-tag type="is-light">{{ contractEnd }}</b-tag>
                      <b-tag type="is-primary">En {{ contractEndsIn }}</b-tag>
                    </b-taglist>
                  </b-field>
                </div>
              </div>

              <div class="columns">
                <div class="column">
                  <b-field expanded>
                    <template slot="label">
                      Salario por hora
                      <b-tooltip type="is-dark" label="Editable">
                        <b-icon size="is-small" icon="pencil"></b-icon>
                      </b-tooltip>
                    </template>
                    <p>{{ salary }}</p>
                  </b-field>
                </div>
                <div class="column">
                  <b-field expanded>
                    <template slot="label">
                      Jornada
                      <b-tooltip type="is-dark" label="Editable">
                        <b-icon size="is-small" icon="pencil"></b-icon>
                      </b-tooltip>
                    </template>
                    <p>{{ daytime }}</p>
                  </b-field>
                </div>
                <div class="column">
                  <b-field expanded>
                    <template slot="label">
                      Tipo de empleado
                      <b-tooltip type="is-dark" label="Editable">
                        <b-icon size="is-small" icon="pencil"></b-icon>
                      </b-tooltip>
                    </template>
                    <p>{{ type }}</p>
                  </b-field>
                </div>
              </div>

              <div class="columns is-multiline" v-if="employee.info_contrato">
                <div class="column is-full">
                  <b-field label="Descripción del contrato" expanded>
                    <p>{{ employee.info_contrato.actual.descripcion }}</p>
                  </b-field>
                </div>

                <div class="column">
                  <b-field label="Contratos antiguos" expanded>
                    <b-table
                      :data="employee.info_contrato.anteriores"
                      :paginated="true"
                      :per-page="3"
                      :mobile-cards="true"
                    >
                      <template slot-scope="props">
                        <b-table-column field="hired" width="40" label="Contratado" centered>
                          <b-tag type="is-primary">{{ formatDate(props.row.fecha_contrato) }}</b-tag>
                        </b-table-column>
                        <b-table-column field="contratEnd" width="40" label="Expira" centered>
                          <b-tag type="is-primary">{{ formatDate(props.row.fecha_salida) }}</b-tag>
                        </b-table-column>
                        <b-table-column field="days" width="40" label="Días" centered>
                          {{ props.row.dias }}
                        </b-table-column>
                        <b-table-column field="description" label="Descripción">
                          {{ props.row.descripcion }}
                        </b-table-column>
                      </template>

                      <template slot="empty">
                        <section class="section">
                          <div class="content has-text-grey has-text-centered">
                            <p>
                              <b-icon icon="emoticon-sad" size="is-large"> </b-icon>
                            </p>
                            <p>Este empleado temporal no ha sido recontratado ninguna vez.</p>
                          </div>
                        </section>
                      </template>
                    </b-table>
                  </b-field>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EmployeeFire from '@/components/employee/EmployeeFire.vue';
import EmployeeUpdate from '@/components/employee/EmployeeUpdate.vue';
import { mapState, mapGetters } from 'vuex';
import store from '@/store';
import { format, formatDistanceToNow, formatDistance } from 'date-fns';
import es from 'date-fns/locale/es';
import numeral from 'numeral';

export default {
  name: 'EmployeeShow',
  props: ['userId'],
  data() {
    return {
      showModal: false,
      description: '',
    };
  },
  async beforeRouteEnter(to, from, next) {
    await store.dispatch('employees/fetchEmployee', to.params.userId);
    next();
  },
  computed: {
    ...mapState({
      employee: state => state.employees.employee,
    }),
    ...mapGetters('employees', ['fullname', 'type', 'dniFormatted']),
    formatDate() {
      return date => format(new Date(date), 'dd/MM/yyyy');
    },
    bornDate() {
      return this.formatDate(this.employee.fecha_nacimiento);
    },
    contractDate() {
      return this.formatDate(this.employee.fecha_contrato);
    },
    contractAgo() {
      return formatDistanceToNow(new Date(this.employee.fecha_contrato), {
        locale: es,
      });
    },
    contractEnd() {
      return this.formatDate(this.employee.info_contrato.actual.fecha_salida);
    },
    contractEndsIn() {
      return formatDistance(new Date(), new Date(this.employee.info_contrato.actual.fecha_salida), {
        locale: es,
      });
    },
    salary() {
      return numeral(this.employee.salario_hora).format('$0,0.00');
    },
    daytime() {
      return this.employee.jornada > 1 ? `${this.employee.jornada} horas` : `${this.employee.jornada} hora`;
    },
  },
  methods: {
    formatPhone(phone) {
      return phone.substr(0, 4) + '-' + phone.substr(4, 7);
    },
    openFireModal() {
      this.$buefy.modal.open({
        parent: this,
        component: EmployeeFire,
        hasModalCard: true,
        trapFocus: true,
        props: {
          employeeId: parseInt(this.$route.params.userId),
        },
      });
    },
    openUpdateModal() {
      this.$buefy.modal.open({
        parent: this,
        component: EmployeeUpdate,
        trapFocus: true,
        width: 600,
      });
    },
  },
};
</script>
