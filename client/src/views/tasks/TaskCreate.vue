<template>
  <div>
    <Navbar />
    <div class="mt-10">
      <div class="container">
        <div class="columns is-multiline is-centered">
          <div class="column is-7">
            <div class="box">
              <h5 class="title is-5">Nueva tarea</h5>
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

                <ValidationProvider rules="required" v-slot="{ errors, valid }" tag="div" class="column is-full">
                  <b-field
                    label="Titulo"
                    :message="errors"
                    :type="{ 'is-danger': errors[0], 'is-success': valid }"
                    expanded
                  >
                    <b-input v-model="title"></b-input>
                  </b-field>
                </ValidationProvider>

                <ValidationProvider rules="required" v-slot="{ errors, valid }" tag="div" class="column is-full">
                  <b-field
                    label="Descripcion"
                    :message="errors"
                    :type="{ 'is-danger': errors[0], 'is-success': valid }"
                    expanded
                  >
                    <b-input v-model="description"></b-input>
                  </b-field>
                </ValidationProvider>

                <div v-if="selectedEmployee && selectedEmployee.tipo === 'Chofer'" class="column is-full">
                  <b-field expanded>
                    <b-switch v-model="transTask">Transporte</b-switch>
                  </b-field>
                </div>

                <ValidationProvider
                  v-if="transTask"
                  rules="required"
                  v-slot="{ errors }"
                  tag="div"
                  class="column is-half"
                >
                  <b-field label="Tipo de servicio" :message="errors" :type="{ 'is-danger': errors[0] }">
                    <b-select v-model="type" placeholder="Selecciona un tipo de servicio" expanded>
                      <option value="Normal">Normal</option>
                      <option value="Especial">Especial</option>
                    </b-select>
                  </b-field>
                </ValidationProvider>

                <ValidationProvider
                  v-if="transTask"
                  rules="required"
                  v-slot="{ errors }"
                  tag="div"
                  class="column is-half"
                >
                  <b-field label="Vehiculo" :message="errors" :type="{ 'is-danger': errors[0] }">
                    <b-select v-model="vehicle" placeholder="Selecciona un tipo de servicio" expanded>
                      <option value="Maximiliano">Maximiliano</option>
                      <option value="Purisco">Purisco</option>
                      <option value="Sanjuaneño">Sanjuaneño</option>
                    </b-select>
                  </b-field>
                </ValidationProvider>

                <ValidationProvider
                  v-if="transTask"
                  rules="required"
                  v-slot="{ errors }"
                  tag="div"
                  class="column is-full"
                >
                  <b-field label="Dias" :message="errors" :type="{ 'is-danger': errors[0] }">
                    <div>
                      <b-checkbox v-for="day in days" :key="day" v-model="choices" :native-value="day">
                        {{ day }}
                      </b-checkbox>
                    </div>
                  </b-field>
                </ValidationProvider>

                <ValidationProvider
                  v-if="transTask && type === 'Normal'"
                  rules="required"
                  v-slot="{ errors }"
                  tag="div"
                  class="column is-full"
                >
                  <b-field label="Horario" :message="errors" :type="{ 'is-danger': errors[0] }">
                    <div>
                      <b-radio
                        v-for="hora in schedule"
                        :key="hora.id"
                        v-model="horario"
                        name="hora"
                        :native-value="hora.id"
                      >
                        {{ `De ${formatTime(hora.hora_entrada)} a ${formatTime(hora.hora_salida)}` }}
                      </b-radio>
                    </div>
                  </b-field>
                </ValidationProvider>

                <ValidationProvider
                  v-if="type === 'Especial'"
                  rules="required"
                  v-slot="{ errors }"
                  tag="div"
                  class="column is-half"
                >
                  <b-field label="Horas de servicio" :message="errors" :type="{ 'is-danger': errors[0] }" expanded>
                    <b-numberinput v-model="horas_servicio"></b-numberinput>
                  </b-field>
                </ValidationProvider>

                <ValidationProvider
                  v-if="type === 'Especial'"
                  :rules="{ required: true, salary: /^₡\s{1}[0-9]{1,3}(,[0-9]{3})*(\.\d{1,2})?$/ }"
                  v-slot="{ errors, valid }"
                  tag="div"
                  class="column is-half"
                >
                  <b-field
                    label="Salario por hora"
                    :message="errors"
                    :type="{ 'is-danger': errors[0], 'is-success': valid }"
                    expanded
                  >
                    <b-input
                      v-model="salary"
                      @input="sendDataToParent"
                      @input.native="setRawSalary"
                      placeholder="0.00"
                      v-cleave="masks.numeral"
                    ></b-input>
                  </b-field>
                </ValidationProvider>

                <div class="column is-full">
                  <b-button
                    type="is-primary"
                    @click="
                      asignar();
                      reset();
                    "
                    :disabled="invalid"
                    expanded
                    >Asignar tarea</b-button
                  >
                </div>
              </ValidationObserver>
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
import Service from '@/services/AdisjService.js';
import { mapGetters } from 'vuex';
import { lightFormat } from 'date-fns';

const precision = Math.pow(10, 2);

export default {
  name: 'TaskCreate',
  components: {
    Navbar,
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      nombre: '',
      selectedEmployee: null,
      title: '',
      description: '',
      transTask: false,
      type: '',
      vehicle: '',
      days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      choices: [],
      schedule: [],
      horario: null,
      horas_servicio: 0,
      salary: '',
      rawSalary: 0,
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
    formatTime() {
      return date => lightFormat(new Date(date), 'hh:mm aaaa');
    },
  },
  methods: {
    setRawSalary(event) {
      this.rawSalary = Math.round(event.target._vCleave.getRawValue() * precision) / precision;
    },
    async asignar() {
      try {
        if (this.transTask) {
          if (this.type === 'Normal') {
            await Service.postTaskDriver(
              this.selectedEmployee.id,
              JSON.stringify({
                titulo: this.title,
                descripcion: this.description,
                asignacion_chofer: {
                  tipo_servicio: this.type,
                  vehiculo: this.vehicle,
                  dias: this.choices,
                  horario: this.horario,
                },
              })
            );
          } else {
            await Service.postTaskDriver(
              this.selectedEmployee.id,
              JSON.stringify({
                titulo: this.title,
                descripcion: this.description,
                asignacion_chofer: {
                  tipo_servicio: this.type,
                  vehiculo: this.vehicle,
                  dias: this.choices,
                  horas_servicio: this.horas_servicio,
                  salario_hora: this.rawSalary,
                },
              })
            );
          }

          this.$buefy.toast.open({
            duration: 2500,
            message: 'Tarea asignada con éxito',
            type: 'is-success',
          });

          return;
        }

        await Service.postTask(
          this.selectedEmployee.id,
          JSON.stringify({
            titulo: this.title,
            descripcion: this.description,
          })
        );

        this.$buefy.toast.open({
          duration: 2500,
          message: 'Tarea asignada con éxito',
          type: 'is-success',
        });
      } catch (error) {
        this.$buefy.toast.open({
          duration: 2500,
          message: 'No se pudo asignar la tarea',
          type: 'is-success',
        });
      }
    },
  },
  async created() {
    this.$store.dispatch('employees/fetchEmployees');
    const { data } = await Service.getSchedule();
    this.schedule = data;
  },
};
</script>
