<template>
  <div>
    <h1 class="title is-4">Credenciales</h1>
    <h2 class="subtitle is-6">
      Crea las credenciales que tendrá el empleado para ingresar al sistema
    </h2>
    <div class="columns">
      <ValidationProvider
        :rules="{ required: true, myEmail: /^\S[a-z0-9\_\-\.]+@[a-z]+(\.\w{2,3}|\.\w{2,3}\.\w{2,3})$/ }"
        v-slot="{ errors, valid }"
        tag="div"
        class="column"
      >
        <b-field label="Correo electrónico" :message="errors" :type="{ 'is-danger': errors[0], 'is-success': valid }">
          <b-input v-model="email" @input="sendDataToParent" maxlength="30" :has-counter="false"></b-input>
        </b-field>
      </ValidationProvider>
    </div>

    <div class="columns">
      <ValidationProvider
        :rules="{ required: true, password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{10,}$/ }"
        vid="password"
        v-slot="{ errors, valid }"
        tag="div"
        class="column"
      >
        <b-field label="Contraseña" :message="errors" :type="{ 'is-danger': errors[0], 'is-success': valid }">
          <b-input v-model="password"></b-input>
        </b-field>
      </ValidationProvider>
    </div>

    <div class="columns">
      <ValidationProvider rules="required|passConfirmed:password" v-slot="{ errors, valid }" tag="div" class="column">
        <b-field label="Confirmar contraseña" :message="errors" :type="{ 'is-danger': errors[0], 'is-success': valid }">
          <b-input v-model="repeatPassword" @input="sendDataToParent"></b-input>
        </b-field>
      </ValidationProvider>
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
