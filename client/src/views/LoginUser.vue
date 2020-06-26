<template>
  <div class="login columns is-centered is-vcentered">
    <div class="column is-one-quarter">
      <h1 class="title has-text-centered">Inicio de sesión</h1>
      <ValidationObserver ref="observer" v-slot="{ invalid }">
        <ValidationProvider rules="required" v-slot="{ errors }">
          <b-field label="Correo electrónico" :message="errors" :type="{ 'is-danger': errors[0] }">
            <b-input v-model="email"></b-input>
          </b-field>
        </ValidationProvider>

        <ValidationProvider rules="required" v-slot="{ errors }">
          <b-field label="Contraseña" :message="errors" :type="{ 'is-danger': errors[0] }">
            <b-input type="password" v-model="password" password-reveal></b-input>
          </b-field>
        </ValidationProvider>
        <b-button type="is-primary" @click="login" :disabled="invalid" expanded>Iniciar sesión</b-button>
      </ValidationObserver>
    </div>
    <div ref="element"></div>
  </div>
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

<style lang="css">
.login {
  height: 100%;
}
</style>
