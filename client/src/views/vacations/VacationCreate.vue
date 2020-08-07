<template>
  <div>
    <Navbar />
    <div class="mt-10">
      <div class="container">
        <div class="columns is-multiline is-centered">
          <div class="column is-7">
            <div class="box">
              <h5 class="title is-5">Nueva solicitud de vacaciones</h5>
              <ValidationObserver ref="observer" v-slot="{ invalid, reset }" tag="div" class="columns is-multiline">
                <div class="column is-half">
                  <div class="columns is-multiline">
                    <div class="column is-full">
                      <nav class="level">
                        <div class="level-item has-text-centered">
                          <div>
                            <p class="heading">Días disponibles</p>
                            <p class="title">{{ availableDays.cantidad || 0 }}</p>
                          </div>
                        </div>
                      </nav>
                    </div>
                    <div class="column is-full">
                      <nav class="level">
                        <div class="level-item has-text-centered">
                          <div>
                            <p class="heading">Días solicitados</p>
                            <p class="title">{{ requestedDays }}</p>
                          </div>
                        </div>
                      </nav>
                    </div>
                    <div class="column is-full">
                      <nav class="level">
                        <div class="level-item has-text-centered">
                          <div>
                            <p class="heading">Días disponibles despúes de la solicitud</p>
                            <p class="title">{{ newAvailableDays }}</p>
                          </div>
                        </div>
                      </nav>
                    </div>
                  </div>
                </div>

                <ValidationProvider rules="required" v-slot="{ errors }" tag="div" class="column is-half">
                  <b-field :message="errors" :type="{ 'is-danger': errors[0] }">
                    <b-datepicker
                      v-model="dates"
                      :day-names="dayNames"
                      :month-names="monthNames"
                      :min-date="new Date()"
                      range
                      inline
                    />
                  </b-field>
                </ValidationProvider>

                <div class="column is-full">
                  <b-button
                    type="is-primary"
                    @click="
                      solicitar();
                      reset();
                    "
                    :disabled="invalid"
                    expanded
                    >Solicitar vacaciones</b-button
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
import { differenceInBusinessDays, format } from 'date-fns';

export default {
  name: 'VacationCreate',
  components: {
    Navbar,
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      availableDays: {},
      dates: [],
      dayNames: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
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
    requestedDays() {
      if (typeof differenceInBusinessDays(new Date(this.dates[1]), new Date(this.dates[0])) !== 'number') {
        return 0;
      } else {
        return differenceInBusinessDays(new Date(this.dates[1]), new Date(this.dates[0])) + 1;
      }
    },
    newAvailableDays() {
      return (this.availableDays.cantidad || 0) - this.requestedDays;
    },
  },
  methods: {
    async solicitar() {
      try {
        await Service.postVacations(
          JSON.stringify({
            fecha_salida: format(new Date(this.dates[0]), 'yyyy-MM-dd'),
            fecha_entrada: format(new Date(this.dates[1]), 'yyyy-MM-dd'),
            cantidad: this.requestedDays,
          })
        );

        this.dates = [];

        const { data } = await Service.getAvailableDays();
        this.availableDays = data;

        this.$buefy.toast.open({
          duration: 2500,
          message: 'Solicitud registrada.',
          type: 'is-success',
        });
      } catch (error) {
        this.$buefy.toast.open({
          duration: 2500,
          message: 'No se pudo solicitar las vaciones.',
          type: 'is-danger',
        });
      }
    },
  },
  async created() {
    const { data } = await Service.getAvailableDays();
    this.availableDays = data;
  },
};
</script>
