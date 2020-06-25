<template>
  <div class="container">
    <Navbar />
    <section class="section">
      <div class="container">
        <div class="columns is-centered is-vcentered">
          <div class="column is-two-fifths">
            {{ newEmployeeData }}
            <ValidationObserver ref="observer" v-slot="{ invalid }">
              <EmployeeType @type-data="setType" />
              <EmployeeBasic @basic-data="setBasic" />
              <EmployeeContact @contact-data="setContact" />
              <EmployeeCredentials @credentials-data="setCredentials" />
              <EmployeeSalary @salary-data="setSalary" />
              <b-field>
                <button class="button is-primary is-pulled-right" @click="saveEmployee" :disabled="invalid">
                  Guardar empleado
                </button>
              </b-field>
            </ValidationObserver>
          </div>
        </div>
      </div>
      <div class="container"></div>
    </section>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import EmployeeType from '@/components/employee/EmployeeCreateType.vue';
import EmployeeBasic from '@/components/employee/EmployeeCreateBasic.vue';
import EmployeeContact from '@/components/employee/EmployeeCreateContact.vue';
import EmployeeCredentials from '@/components/employee/EmployeeCreateCredentials.vue';
import EmployeeSalary from '@/components/employee/EmployeeCreateSalary.vue';
import store from '@/store';
import { ValidationObserver } from 'vee-validate';
import Service from '@/services/AdisjService.js';

export default {
  name: 'EmployeeCreate',
  components: {
    Navbar,
    EmployeeType,
    EmployeeBasic,
    EmployeeContact,
    EmployeeCredentials,
    EmployeeSalary,
    ValidationObserver,
  },
  data() {
    return {
      newEmployeeData: {},
    };
  },
  async beforeRouteEnter(to, from, next) {
    await store.dispatch('employees/fetchAddressCatalogue');
    next();
  },
  methods: {
    setType(data) {
      this.newEmployeeData = { ...this.newEmployeeData, ...data };
    },
    setBasic(data) {
      this.newEmployeeData = { ...this.newEmployeeData, ...data };
    },
    setContact(data) {
      this.newEmployeeData = { ...this.newEmployeeData, ...data };
    },
    setCredentials(data) {
      this.newEmployeeData = { ...this.newEmployeeData, ...data };
    },
    setSalary(data) {
      this.newEmployeeData = { ...this.newEmployeeData, ...data };
    },
    async saveEmployee() {
      console.log(this);

      try {
        await Service.postEmployee(JSON.stringify({ ...this.newEmployeeData, activo: true }));
        this.$buefy.toast.open({
          duration: 3000,
          message: 'Empleado guardado con éxito.',
          type: 'is-success',
        });
      } catch (error) {
        this.$buefy.toast.open({
          duration: 3000,
          message: 'No se pudo guardar el empleado.',
          // position: 'is-bottom',
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
