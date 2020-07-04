<template>
  <div class="box">
    {{ reason }}| {{ hours }}
    <h1 class="title is-4">Editando solicitud de horas extra</h1>
    <ValidationObserver ref="observer" v-slot="{ invalid }" tag="div" class="columns is-multiline">
      <ValidationProvider
        :rules="{ required: true, alpha_spaces: /^[a-zA-Z\s]*$/ }"
        v-slot="{ errors, valid }"
        tag="div"
        class="column is-full"
      >
        <b-field label="Motivo" :message="errors" :type="{ 'is-danger': errors[0], 'is-success': valid }" expanded>
          <b-input v-model="reason"></b-input>
        </b-field>
      </ValidationProvider>

      <ValidationProvider rules="required|numeric" v-slot="{ errors, valid }" tag="div" class="column is-one-third">
        <b-field label="Cantidad" :message="errors" :type="{ 'is-danger': errors[0], 'is-success': valid }" expanded>
          <b-numberinput v-model="hours" min="1" max="5" :editable="false"></b-numberinput>
        </b-field>
      </ValidationProvider>
      <div class="column is-full">
        <div class="buttons is-pulled-right">
          <button class="button is-light" @click="$parent.close()">Cancelar</button>
          <button class="button is-primary" @click="update" :disabled="invalid">Continuar</button>
        </div>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { max_value, numeric, max } from 'vee-validate/dist/rules';
import { mapGetters, mapActions } from 'vuex';
import Service from '@/services/AdisjService.js';

extend('max_value', {
  ...max_value,
  message: '¡Esas son muchas horas! Intenta con menos.',
});
extend('numeric', {
  ...numeric,
  message: 'Solo caracteres numericos.',
});
extend('max', {
  ...max,
  message: 'La descripción excede el límite.',
});

export default {
  name: 'OvertimeUpdate',
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  props: {
    overtimeId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      reason: '',
      hours: null,
    };
  },
  computed: { ...mapGetters('overtime', ['getOvertime']) },
  methods: {
    ...mapActions('overtime', ['updateOvertime']),
    update() {
      this.$buefy.dialog.confirm({
        title: `¡Atención!`,
        message: 'Esta <b>solicitud</b> automáticamente pasará a tener un estado pendiente de aprobación.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        type: 'is-warning',
        hasIcon: true,
        onConfirm: async () => {
          try {
            await Service.putOvertimeEmployee(this.overtimeId, {
              descripcion: this.reason,
              cantidad_horas: parseInt(this.hours),
            });
            this.updateOvertime({
              overtimeId: this.overtimeId,
              description: this.reason,
              hours: parseInt(this.hours),
            });
            this.$parent.close();
            this.$buefy.toast.open({
              duration: 3000,
              message: 'Horas extra editato con éxito.',
              type: 'is-success',
            });
          } catch (error) {
            this.$parent.close();
            this.$buefy.toast.open({
              duration: 3000,
              message: 'No se pudo editar estas horas extra.',
              type: 'is-danger',
            });
          }
        },
        onCancel: () => this.$parent.close(),
      });
    },
  },
  created() {
    this.reason = this.getOvertime(this.overtimeId).descripcion;
    this.hours = this.getOvertime(this.overtimeId).cantidad_horas;
  },
};
</script>
