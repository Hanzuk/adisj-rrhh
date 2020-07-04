<template>
  <ValidationObserver ref="observer" v-slot="{ invalid }" tag="div" class="h-full columns is-centered is-vcentered">
    <div class="column is-one-quarter">
      <div class="columns is-multiline">
        <div class="column is-full">
          <h1 class="title has-text-centered">Inicio de sesión</h1>
        </div>
        <div class="column is-full">
          <ValidationProvider rules="required" v-slot="{ errors }" tag="div">
            <b-field label="Correo electrónico" :message="errors" :type="{ 'is-danger': errors[0] }">
              <b-input v-model="email"></b-input>
            </b-field>
          </ValidationProvider>
        </div>
        <div class="column is-full">
          <ValidationProvider rules="required" v-slot="{ errors }" tag="div">
            <b-field label="Contraseña" :message="errors" :type="{ 'is-danger': errors[0] }">
              <b-input type="password" v-model="password" password-reveal></b-input>
            </b-field>
          </ValidationProvider>
        </div>
        <div class="column is-full">
          <b-button type="is-primary" @click="login" :disabled="invalid" expanded>Iniciar sesión</b-button>
        </div>
      </div>
    </div>
    <div ref="element"></div>
  </ValidationObserver>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate';

export default {
  name: 'Login',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async login() {
      const loadingComponent = this.$buefy.loading.open({
        container: this.$refs.element.$el,
      });

      try {
        await this.$store.dispatch('auth/login', {
          correo: this.email,
          clave: this.password,
        });

        loadingComponent.close();
        this.$router.push({ name: 'dashboard' });
      } catch (error) {
        loadingComponent.close();
        // this.error = error.response.data.message;
        this.$buefy.toast.open({
          duration: 3000,
          message: 'Al parecer estas credenciales son inválidas.',
          // position: 'is-bottom',
          type: 'is-danger',
        });
      }
    },
  },
};
</script>
