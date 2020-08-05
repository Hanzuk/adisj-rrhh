<template>
  <div class="mt-10">
    <div class="container">
      <div class="columns is-multiline">
        <div class="column is-full">
          <div class="box">
            <h4 class="title is-4">Consulta de pagos</h4>
            <!-- <b-message type="is-info">
              Selecciona el mes y a los empleados que quieres consultarles el pago.
            </b-message> -->
            <b-field>
              <b-datepicker
                type="month"
                v-model="date"
                :month-names="monthNames"
                placeholder="Elije un mes"
                icon="calendar-today"
              />
            </b-field>
            <b-table
              :data="employees.employees"
              :paginated="true"
              :per-page="10"
              :mobile-cards="true"
              :checked-rows.sync="checkedRows"
              checkable
            >
              <template slot-scope="props">
                <b-table-column label="ID" width="40" centered>
                  {{ props.row.id }}
                </b-table-column>
                <b-table-column label="Nombre empleado">
                  {{ `${props.row.nombre} ${props.row.p_apellido} ${props.row.s_apellido}` }}
                </b-table-column>
                <b-table-column label="Fecha de contrato" centered>
                  <b-tag type="is-primary">{{ formatDate(props.row.fecha_contrato) }}</b-tag>
                </b-table-column>
                <b-table-column label="Tipo de empleado">
                  {{ props.row.tipo_empleado }}
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
            <div class="buttons">
              <b-button type="is-primary" @click="calcSalary" :disabled="date === null || checkedRows.length === 0"
                >Consultar</b-button
              >
              <b-button type="is-info" @click="genReport" :disabled="date === null || checkedRows.length === 0"
                >Generar reporte</b-button
              >
            </div>
          </div>
        </div>

        <div class="column is-full">
          <div class="box">
            <h4 class="title is-4">Detalles</h4>
            <b-message type="is-info">
              <p>El porcentaje de cargas sociales corresponde a un 10.5%.</p>
              <p>Expande la fila para ver más información.</p>
            </b-message>
            <b-table
              :data="wages"
              :paginated="true"
              :per-page="10"
              :mobile-cards="true"
              :hoverable="true"
              :scrollable="true"
              :bordered="true"
              :loading="isLoading"
              detailed
            >
              <template slot-scope="props">
                <b-table-column label="Empleado" width="300">
                  {{ props.row.empleado }}
                </b-table-column>
                <b-table-column label="Salario por hora" width="150" centered>
                  {{ formatSalary(props.row.salario_hora) }}
                </b-table-column>
                <b-table-column label="Jornada diaria" width="150" centered>
                  {{ props.row.jornada }}
                </b-table-column>
                <b-table-column label="Horas extras" width="150" centered>
                  {{ props.row.horas_extras }}
                </b-table-column>
                <b-table-column label="Salario bruto" centered>
                  {{ formatSalary(props.row.salario_bruto) }}
                </b-table-column>
                <b-table-column label="Salario especial" width="150" centered>
                  +{{ formatSalary(props.row.salario_especial_chofer) }}
                </b-table-column>
                <b-table-column label="Salario neto" class="has-text-success" centered>
                  {{ formatSalary(props.row.salario_neto - props.row.retenciones) }}
                </b-table-column>
              </template>

              <template slot="detail" slot-scope="props">
                <b-field grouped group-multiline>
                  <div class="control">
                    <b-taglist attached>
                      <b-tag type="is-dark">Horas descontadas por permisos</b-tag>
                      <b-tag type="is-danger">{{ props.row.horas_permisos }}</b-tag>
                    </b-taglist>
                  </div>
                  <div class="control">
                    <b-taglist attached>
                      <b-tag type="is-dark">Retenciones</b-tag>
                      <b-tag type="is-danger">{{ formatSalary(props.row.retenciones * -1) }}</b-tag>
                    </b-taglist>
                  </div>
                  <div class="control">
                    <b-taglist attached>
                      <b-tag type="is-dark">Impuesto de renta</b-tag>
                      <b-tag type="is-danger">{{ formatSalary(props.row.impuesto_renta * -1) }}</b-tag>
                    </b-taglist>
                  </div>
                  <div class="control">
                    <b-taglist attached>
                      <b-tag type="is-dark">C.C.S.S</b-tag>
                      <b-tag type="is-danger">{{ formatSalary(props.row.total_deduccion * -1) }}</b-tag>
                    </b-taglist>
                  </div>
                  <div class="control">
                    <b-taglist attached>
                      <b-tag type="is-dark">Aguinaldo</b-tag>
                      <b-tag type="is-success">{{ formatSalary(props.row.aguinaldo) }}</b-tag>
                    </b-taglist>
                  </div>
                </b-field>
              </template>

              <template slot="empty">
                <section class="section">
                  <div class="content has-text-grey has-text-centered">
                    <p>
                      <b-icon icon="emoticon-sad" size="is-large"> </b-icon>
                    </p>
                    <p>No se pudo cargar los salarios.</p>
                  </div>
                </section>
              </template>
            </b-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { format, getYear, getMonth } from 'date-fns';
import Service from '@/services/AdisjService.js';
import numeral from 'numeral';

export default {
  name: 'Payroll',
  data() {
    return {
      date: null,
      checkedRows: [],
      wages: [],
      isLoading: false,
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
    ...mapState(['employees', 'auth']),
    formatDate() {
      return date => format(new Date(date), 'dd/MM/yyyy');
    },
    formatSalary() {
      return amount => numeral(amount).format('$0,0.00');
    },
    employeesIds() {
      return this.checkedRows.map(employee => employee.id);
    },
  },
  methods: {
    async calcSalary() {
      this.isLoading = true;
      try {
        const { data } = await Service.getSalary(
          JSON.stringify({
            employeesIds: this.employeesIds,
            year: getYear(new Date(this.date)),
            month: getMonth(new Date(this.date)) + 1,
          })
        );
        this.isLoading = false;
        this.wages = data;
      } catch (error) {
        this.isLoading = false;
      }
    },
    async genReport() {
      try {
        const { data } = await Service.genSalReport(
          JSON.stringify({
            employeesIds: this.employeesIds,
            year: getYear(new Date(this.date)),
            month: getMonth(new Date(this.date)) + 1,
          })
        );

        const fileURL = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
        const fileLink = document.createElement('a');
        fileLink.href = fileURL;
        fileLink.setAttribute('download', 'REPORTE-SALARIOS.pdf');
        document.body.appendChild(fileLink);
        fileLink.click();
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.$store.dispatch('employees/fetchEmployees');
  },
};
</script>
