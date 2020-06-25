<template>
  <div class="credentials-info">
    <h1 class="title is-4">Credenciales</h1>
    <h2 class="subtitle is-6">
      Ingresa las credenciales que tendrá el empleado para ingresar al sistema
    </h2>
    <div class="columns">
      <div class="column">
        <ValidationProvider :rules="{ required: true, myEmail: myEmailRegex }" v-slot="{ errors, valid }">
          <b-field label="Correo electrónico" :message="errors" :type="{ 'is-danger': errors[0], 'is-success': valid }">
            <b-input v-model="email" @input="sendDataToParent"></b-input>
          </b-field>
        </ValidationProvider>
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <ValidationProvider
          :rules="{ required: true, password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{10,}$/ }"
          vid="password"
          v-slot="{ errors, valid }"
        >
          <b-field label="Contraseña" :message="errors" :type="{ 'is-danger': errors[0], 'is-success': valid }">
            <b-input v-model="password"></b-input>
          </b-field>
        </ValidationProvider>
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <ValidationProvider rules="required|passConfirmed:password" v-slot="{ errors, valid }">
          <b-field
            label="Confirmar contraseña"
            :message="errors"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
          >
            <b-input v-model="repeatPassword" @input="sendDataToParent"></b-input>
          </b-field>
        </ValidationProvider>
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <b-message type="is-warning" size="is-small">
          <div class="content">
            <p><strong>Nota:</strong> La contraseña debe de cumplir los siguientes parámetros:</p>
            <ul>
              <li>Una longitud de 10 caracteres.</li>
              <li>Únicamente debe contener letras y números.</li>
              <li>Al menos una letra mayúscula y un número.</li>
            </ul>
          </div>
        </b-message>
      </div>
    </div>
  </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate';

export default {
  name: 'EmployeeCredentials',
  components: {
    ValidationProvider,
  },
  data() {
    return {
      email: '',
      password: '',
      repeatPassword: '',
      myEmailRegex: /^(([^<>()[\]\\.,;:!#$%^&+*\s@"]+(\.[^<>()\\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    };
  },
  methods: {
    sendDataToParent() {
      this.$emit('credentials-data', {
        correo: this.email,
        clave: this.repeatPassword,
      });
    },
  },
};
</script>
