<template>
  <ValidationObserver ref="observer" v-slot="{ invalid }" tag="div" class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Despidiendo a {{ fullname }}</p>
    </header>
    <ValidationProvider
      :rules="{ required: true, alpha_spaces: /^[a-zA-Z\s]*$/ }"
      v-slot="{ errors, valid }"
      tag="section"
      class="modal-card-body"
    >
      <b-field label="Motivo" :message="errors" :type="{ 'is-danger': errors[0], 'is-success': valid }" expanded>
        <b-input v-model="description"></b-input>
      </b-field>
    </ValidationProvider>
    <footer class="modal-card-foot">
      <button class="button" @click="$parent.close()">Cancelar</button>
      <button class="button is-primary" @click="fire" :disabled="invalid">Continuar</button>
    </footer>
  </ValidationObserver>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { mapGetters } from 'vuex';
import Service from '@/services/AdisjService.js';

export default {
  name: 'EmployeeFire',
  components: { ValidationProvider, ValidationObserver },
  props: {
    employeeId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      description: '',
    };
  },
  computed: { ...mapGetters('employees', ['fullname']) },
  methods: {
    fire() {
      this.$buefy.dialog.confirm({
        title: `¿Despedir a ${this.fullname}?`,
        message: '¿Seguro que quieres <b>despedir</b> este empleado? Esta acción no se puede revertir.',
        confirmText: 'Despedir',
        cancelText: 'Cancelar',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: async () => {
          try {
            await Service.deleteEmployee(this.employeeId, JSON.stringify({ descripcion: this.description }));
            this.$parent.close();
            this.$router.push({ name: 'employees' });
            this.$buefy.toast.open(`¡Éxito al despedir a ${this.fullname}!`);
          } catch (error) {
            this.$parent.close();
            this.$buefy.toast.open(`¡Hubo un error al despedir a ${this.fullname}!`);
          }
        },
        onCancel: () => this.$parent.close(),
      });
    },
  },
};
</script>
