<template>
  <div>
    <Navbar />
    <section class="section">
      <div class="container">
        <div class="columns is-centered is-vcentered">
          <div class="column is-two-fifths">
            <div>
              <h3 class="title is-3">Agregar un nuevo empleado</h3>
              <b-field label="Tipo">
                <b-select
                  placeholder="Selecciona que tipo de empleado será"
                  expanded
                >
                  <option>Permanente</option>
                  <option>Temporal</option>
                </b-select>
              </b-field>
            </div>
            <div class="personal-info">
              <h1 class="title is-4">Información personal</h1>
              <h2 class="subtitle is-6">
                Ingresa los datos personales del nuevo empleado
              </h2>
              <b-field grouped>
                <b-field label="Cédula" expanded>
                  <b-input></b-input>
                </b-field>
                <b-field label="Nombre" expanded>
                  <b-input></b-input>
                </b-field>
              </b-field>
              <b-field grouped>
                <b-field label="Primer apellido" expanded>
                  <b-input></b-input>
                </b-field>
                <b-field label="Segundo apellido" expanded>
                  <b-input></b-input>
                </b-field>
              </b-field>
              <b-field label="Fecha de nacimiento">
                <b-datepicker
                  :day-names="dayNames"
                  :month-names="monthNames"
                  :first-day-of-week="1"
                  placeholder="Buscar fecha..."
                >
                </b-datepicker>
              </b-field>
            </div>
            <div class="contact-info">
              <h1 class="title is-4">Información de contacto</h1>
              <h2 class="subtitle is-6">
                Ingresa los datos de domicilio y teléfonos
              </h2>
              <b-field grouped>
                <b-field label="Provincia">
                  <b-select placeholder="Selecciona uno">
                    <option>Mr.</option>
                  </b-select>
                </b-field>
                <b-field label="Cantón">
                  <b-select placeholder="Selecciona uno">
                    <option>Mr.</option>
                  </b-select>
                </b-field>
                <b-field label="Distrito">
                  <b-select placeholder="Selecciona uno">
                    <option>Mr.</option>
                  </b-select>
                </b-field>
              </b-field>
              <b-field grouped>
                <b-field label="Números de teléfono" expanded>
                  <b-field>
                    <b-select placeholder="Tipo">
                      <option>Celular</option>
                      <option>Casa</option>
                    </b-select>
                    <b-input expanded></b-input>
                    <p class="control">
                      <button class="button is-primary">Agregar</button>
                    </p>
                  </b-field>
                </b-field>
              </b-field>
              <b-field label="Dirección exacta">
                <b-input></b-input>
              </b-field>
            </div>
            <div class="credentials-info">
              <h1 class="title is-4">Credenciales</h1>
              <h2 class="subtitle is-6">
                Ingresa las credenciales que tendrá el empleado para ingresar al
                sistema
              </h2>
              <b-field label="Correo electrónico">
                <b-input></b-input>
              </b-field>
              <b-field label="Contraseña">
                <b-input></b-input>
              </b-field>
              <b-message type="is-warning" size="is-small">
                <div class="content">
                  <p>
                    <strong>Nota:</strong> La contraseña debe de cumplir los
                    siguientes parámetros:
                  </p>
                  <ul>
                    <li>Una longitud de 10 caracteres.</li>
                    <li>Únicamente debe contener letras y números.</li>
                    <li>Al menos una letra mayúscula.</li>
                    <li>Al menos un número.</li>
                  </ul>
                </div>
              </b-message>
            </div>
            <div class="salary-info">
              <h1 class="title is-4">Salario</h1>
              <h2 class="subtitle is-6">
                Ingresa el salario por hora y las horas por día que trabajará el
                nuevo empleado
              </h2>
              <b-field grouped>
                <b-field label="Salario por hora">
                  <b-field expanded>
                    <p class="control">
                      <span class="button is-static">₡</span>
                    </p>
                    <b-input placeholder="0,00"></b-input>
                  </b-field>
                </b-field>
                <b-field label="Horas de trabajo por día" expanded>
                  <b-input type="number"></b-input>
                </b-field>
              </b-field>
            </div>
            <b-field>
              <button
                class="button is-primary is-pulled-right"
                @click="saveEmployee"
              >
                Guardar empleado
              </button>
            </b-field>
          </div>
        </div>
      </div>
      <div class="container"></div>
    </section>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'NewEmployee',
  components: {
    Navbar,
  },
  data() {
    return {
      dayNames: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
      monthNames: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ],
    };
  },
  methods: {
    async saveEmployee() {
      try {
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
