<template>
  <div class="columns is-centered is-vcentered h-full">
    <div class="column is-one-quarter">
      <ValidationObserver ref="observer" v-slot="{ invalid }" tag="div" class="box">
        <ValidationProvider rules="required" v-slot="{ errors }" tag="div">
          <b-field
            label="¿Con cual de nuestros choferes realizaste el viaje?"
            :message="errors"
            :type="{ 'is-danger': errors[0] }"
          >
            <b-select v-model="employeeId" placeholder="" expanded>
              <option v-for="driver in drivers" :value="driver.id" :key="driver.id">
                {{ driver.nombre }}
              </option>
            </b-select>
          </b-field>
        </ValidationProvider>
        <ValidationProvider rules="required" v-slot="{ errors }" tag="div">
          <b-field :message="errors" :type="{ 'is-danger': errors[0] }">
            <template slot="label">
              ¿Cual es tu nombre?
              <b-tooltip
                type="is-dark"
                label="Pedimos tu nombre para corroborar que en realidad viajaste con nosotros."
              >
                <b-icon size="is-small" icon="help-circle-outline"></b-icon>
              </b-tooltip>
            </template>
            <b-input v-model="clientName"></b-input>
          </b-field>
        </ValidationProvider>
        <ValidationProvider rules="required" v-slot="{ errors }" tag="div">
          <b-field :message="errors" :type="{ 'is-danger': errors[0] }">
            <template slot="label">
              ¿Que te pareció el trato del conductor?
              <b-tooltip type="is-dark" label="Tu comentario nos ayudará a mejorar nuestro servicio.">
                <b-icon size="is-small" icon="help-circle-outline"></b-icon>
              </b-tooltip>
            </template>
            <b-input v-model="comment"></b-input>
          </b-field>
        </ValidationProvider>
        <ValidationProvider rules="required" v-slot="{ errors }" tag="div">
          <b-field label="¿Cómo calificas el trato recibido?" :message="errors" :type="{ 'is-danger': errors[0] }">
            <b-rate v-model="rating" size="is-medium"></b-rate>
          </b-field>
        </ValidationProvider>
        <b-field>
          <b-button @click="vote" class="button" type="is-success" :disabled="invalid" expanded
            >Enviar formulario</b-button
          >
        </b-field>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import Service from '@/services/AdisjService.js';
import { ValidationObserver, ValidationProvider } from 'vee-validate';

export default {
  name: 'Vote',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      drivers: null,
      employeeId: null,
      clientName: '',
      comment: '',
      rating: 0,
    };
  },
  async created() {
    const { data } = await Service.getDrivers();
    this.drivers = data;
  },
  methods: {
    async vote() {
      try {
        await Service.postQuality({
          id_empleado: parseInt(this.employeeId),
          calificacion: this.rating,
          nombre_cliente: this.clientName,
          comentario: this.comment,
        });

        this.$buefy.toast.open({
          duration: 2000,
          message: '¡Gracias por tus respuestas!',
          type: 'is-success',
        });
      } catch (error) {
        this.$buefy.toast.open({
          duration: 2000,
          message: 'No se pudo enviar el formulario. Lo sentimos.',
          type: 'is-danger',
        });
      }
    },
  },
};
</script>
