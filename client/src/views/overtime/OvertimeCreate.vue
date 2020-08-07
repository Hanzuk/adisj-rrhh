<template>
  <div>
    <Navbar />
    <div class="container">
      <div class="mt-10">
        <div class="columns">
          <div class="column is-half is-offset-one-quarter">
            <div class="box">
              <h1 class="title is-4">Solicitar horas extra</h1>
              <ValidationObserver ref="observer" v-slot="{ invalid, reset }" tag="div" class="columns is-multiline">
                <ValidationProvider
                  :rules="{ required: true, alpha_spaces: /^[a-zA-Z\sñáéíóú]*$/ }"
                  v-slot="{ errors, valid }"
                  tag="div"
                  class="column is-full"
                >
                  <b-field
                    label="Motivo"
                    :message="errors"
                    :type="{ 'is-danger': errors[0], 'is-success': valid }"
                    expanded
                  >
                    <b-input v-model="reason"></b-input>
                  </b-field>
                </ValidationProvider>
                <ValidationProvider
                  rules="required|numeric|max_value:5"
                  v-slot="{ errors, valid }"
                  tag="div"
                  class="column is-5"
                >
                  <b-field
                    label="Cantidad"
                    :message="errors"
                    :type="{ 'is-danger': errors[0], 'is-success': valid }"
                    expanded
                  >
                    <b-numberinput v-model="hours" min="1" :editable="false"></b-numberinput>
                  </b-field>
                </ValidationProvider>
                <div class="column is-full">
                  <button
                    class="button is-primary is-pulled-right"
                    :disabled="invalid"
                    @click="
                      requestOvertime();
                      reset();
                    "
                  >
                    Solicitar
                  </button>
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

export default {
  name: 'OvertimeCreate',
  components: {
    Navbar,
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      reason: '',
      hours: null,
    };
  },
  methods: {
    async requestOvertime() {
      try {
        await Service.postOvertime(
          JSON.stringify({
            descripcion: this.reason,
            cantidad_horas: parseInt(this.hours),
          })
        );

        this.reason = '';
        this.hours = null;

        this.$buefy.toast.open({
          duration: 1500,
          message: 'Solicitud creada con éxito.',
          type: 'is-success',
        });
      } catch (error) {
        this.$buefy.toast.open({
          duration: 1500,
          message: 'No se pudo crear esta solicitud.',
          type: 'is-danger',
        });
      }
    },
  },
};
</script>
