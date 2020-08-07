<template>
  <div>
    <Navbar />
    <div class="container">
      <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
      <ValidationObserver ref="observer" v-slot="{ invalid }" tag="div" class="mt-10">
        <div class="card">
          <div class="card-content">
            <div class="columns">
              <div class="column">
                <EmployeeBasic @basic-data="setBasic" />
              </div>
              <div class="column">
                <EmployeeCredentials @credentials-data="setCredentials" />
              </div>
            </div>
          </div>
        </div>
        <div class="card mt-10 mb-10">
          <div class="card-content">
            <div class="columns">
              <div class="column">
                <EmployeeContact @contact-data="setContact" />
              </div>
              <div class="column">
                <EmployeeCreateLabour @labour-data="setLabour" />
              </div>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <button class="button is-primary is-pulled-right" @click="saveEmployee" :disabled="invalid">
              Guardar empleado
            </button>
          </div>
        </div>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import EmployeeBasic from '@/components/employee/EmployeeCreateBasic.vue';
import EmployeeContact from '@/components/employee/EmployeeCreateContact.vue';
import EmployeeCredentials from '@/components/employee/EmployeeCreateCredentials.vue';
import EmployeeCreateLabour from '@/components/employee/EmployeeCreateLabour.vue';
import store from '@/store';
import { ValidationObserver } from 'vee-validate';
import Service from '@/services/AdisjService.js';

export default {
  name: 'EmployeeCreate',
  components: {
    Navbar,
    EmployeeBasic,
    EmployeeContact,
    EmployeeCredentials,
    EmployeeCreateLabour,
    ValidationObserver,
  },
  data() {
    return {
      newEmployeeData: {},
      isLoading: false,
    };
  },
  async beforeRouteEnter(to, from, next) {
    await store.dispatch('employees/fetchAddressCatalogue');
    next();
  },
  methods: {
    setBasic(data) {
      this.newEmployeeData = { ...this.newEmployeeData, ...data };
    },
    setContact(data) {
      this.newEmployeeData = { ...this.newEmployeeData, ...data };
    },
    setCredentials(data) {
      this.newEmployeeData = { ...this.newEmployeeData, ...data };
    },
    setLabour(data) {
      this.newEmployeeData = { ...this.newEmployeeData, ...data };
    },
    async saveEmployee() {
      this.isLoading = true;

      try {
        if (this.newEmployeeData.tipo_empleado == 4) {
          await Service.postTemporary(JSON.stringify({ ...this.newEmployeeData, activo: true }));
        } else {
          await Service.postPermanent(JSON.stringify({ ...this.newEmployeeData, activo: true }));
        }

        await Service.sendCredentials(
          JSON.stringify({
            to: this.newEmployeeData.correo,
            name: this.newEmployeeData.nombre,
            email: this.newEmployeeData.correo,
            password: this.newEmployeeData.clave,
          })
        );

        this.isLoading = false;

        this.$buefy.toast.open({
          duration: 3000,
          message: 'Empleado guardado con éxito.',
          type: 'is-success',
        });
      } catch (error) {
        this.isLoading = false;

        this.$buefy.toast.open({
          duration: 3000,
          message: 'No se pudo guardar el empleado.',
          type: 'is-danger',
        });
      }
    },
  },
};
</script>

<style>
.personal-info {
  margin-top: 30px;
  margin-bottom: 30px;
  padding-top: 20px;
  padding-bottom: 30px;
  box-shadow: 0px -1px 0px 0px #e2e8f0, 0px 1px 0px 0px #e2e8f0;
}

.contact-info,
.credentials-info {
  margin-bottom: 30px;
  padding-bottom: 30px;
  box-shadow: 0px 1px 0px 0px #e2e8f0;
}

.salary-info {
  margin-bottom: 30px;
  /* box-shadow: 0px 1px 0px 0px #e2e8f0; */
}
</style>
