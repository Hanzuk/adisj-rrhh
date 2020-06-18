<template>
  <div class="login columns is-centered is-vcentered">
    <div class="column is-one-quarter">
      <h1 class="title">Inicio de sesión</h1>
      <h2 class="subtitle">Subtitle</h2>
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
            'La contraseña debe contener almenos 10 caracteres':
              !$v.password.minLength && $v.password.$error,
          },
          {
            'Este campo es requerido':
              !$v.password.required && $v.password.$error,
          },
        ]"
        :type="{ 'is-danger': $v.password.$error }"
      >
        <b-input
          type="password"
          v-model="password"
          @blur="$v.password.$touch()"
          password-reveal
        ></b-input>
      </b-field>
      <p>{{ error }}</p>
      <b-button
        type="is-primary"
        @click="login"
        :disabled="$v.$invalid"
        expanded
        >Iniciar sesión</b-button
      >
    </div>
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
      error: null,
    };
  },
  validations: {
    email: {
      required,
      email,
    },
    password: {
      required,
      minLength: minLength(2),
    },
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch('auth/login', {
          correo: this.email,
          clave: this.password,
        });

        this.$router.push({ name: 'dashboard' });
      } catch (error) {
        this.error = error.response.data.message;
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
