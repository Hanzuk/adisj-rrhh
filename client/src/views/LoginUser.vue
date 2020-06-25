<template>
  <div class="login columns is-centered is-vcentered">
    <div class="column is-one-quarter">
      <h1 class="title has-text-centered">Inicio de sesión</h1>
      <b-field
        label="Correo electrónico"
        :message="[
          { 'Correo electrónico inválido': !$v.email.email && $v.email.$error },
          { 'Este campo es requerido': !$v.email.required && $v.email.$error },
        ]"
        :type="{ 'is-danger': $v.email.$error }"
      >
        <b-input v-model="email" @blur="$v.email.$touch()"></b-input>
      </b-field>
      <b-field
        label="Contraseña"
        :message="[
          {
            'La contraseña debe contener almenos 10 caracteres': !$v.password.minLength && $v.password.$error,
          },
          {
            'Este campo es requerido': !$v.password.required && $v.password.$error,
          },
        ]"
        :type="{ 'is-danger': $v.password.$error }"
      >
        <b-input type="password" v-model="password" @blur="$v.password.$touch()" password-reveal></b-input>
      </b-field>
      <b-button type="is-primary" @click="login" :disabled="$v.$invalid" expanded>Iniciar sesión</b-button>
    </div>
    <div ref="element"></div>
  </div>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  validations: {
    email: { required, email },
    password: { required, minLength: minLength(2) },
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
