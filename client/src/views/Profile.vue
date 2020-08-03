<template>
  <div class="mt-10">
    <div class="container">
      <div class="columns is-multiline is-centered">
        <div class="column is-7">
          <div class="box">
            <h5 class="title is-5">Mi información</h5>
            <b-field grouped>
              <b-field label="Número de cédula" expanded>
                <div class="flex">
                  <b-icon icon="card-account-details"></b-icon>
                  <span class="ml-2">{{ dniFormatted(profile.cedula) }}</span>
                </div>
              </b-field>
              <b-field label="Nombre" expanded>
                <p>{{ profile.nombre }}</p>
              </b-field>
              <b-field label="Primer apellido" expanded>
                <p>{{ profile.p_apellido }}</p>
              </b-field>
              <b-field label="Segundo apellido" expanded>
                <p>{{ profile.s_apellido }}</p>
              </b-field>
            </b-field>

            <b-field grouped>
              <b-field label="Fecha de nacimiento" expanded>
                <span class="ml-2">{{ formatDate(profile.fecha_nacimiento) }}</span>
              </b-field>
              <b-field label="Correo electronico" expanded>
                <p>{{ profile.correo }}</p>
              </b-field>

              <b-field label="Tipo de empleado" expanded>
                <p>{{ profile.tipo_empleado }}</p>
              </b-field>
            </b-field>

            <b-field grouped>
              <b-field label="Provincia" expanded>
                <span class="ml-2">{{ profile.direccion.provincia }}</span>
              </b-field>
              <b-field label="Canton" expanded>
                <p>{{ profile.direccion.canton }}</p>
              </b-field>
              <b-field label="Distrito" expanded>
                <p>{{ profile.direccion.distrito }}</p>
              </b-field>
            </b-field>

            <b-field label="Direccion exacta" expanded>
              <p>{{ profile.direccion.direccion }}</p>
            </b-field>

            <b-field label="Números de teléfono"></b-field>
            <b-field v-for="phone in profile.telefonos" :key="phone.id" expanded>
              <b-icon :icon="phone.tipo_telefono === 'Celular' ? 'cellphone-iphone' : 'phone-classic'"></b-icon>
              <span class="ml-2">{{ formatPhone(phone.numero) }}</span>
            </b-field>

            <b-field grouped>
              <b-field label="Salario" expanded>
                <span class="ml-2">{{ salary(profile.salario_hora) }}</span>
              </b-field>
              <b-field label="Jornada" expanded>
                <p>{{ profile.jornada }}</p>
              </b-field>
              <b-field label="Fecha de contrato" expanded>
                <p>{{ formatDate(profile.fecha_contrato) }}</p>
              </b-field>
            </b-field>

            <b-button type="is-primary" @click="openUpdateModal">Actualizar</b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Service from '@/services/AdisjService.js';
import ProfileUpdate from '@/components/profile/ProfileModal.vue';
import numeral from 'numeral';
import { format } from 'date-fns';
import { mapState } from 'vuex';
import store from '@/store';

export default {
  name: 'Profile',
  data() {
    return {
      info: {
        direccion: {},
      },
    };
  },
  async beforeRouteEnter(to, from, next) {
    await store.dispatch('profile/fetchProfile');
    await store.dispatch('employees/fetchAddressCatalogue');
    next();
  },
  computed: {
    ...mapState({
      profile: state => state.profile.profile,
    }),
    dniFormatted() {
      return dni => dni.substr(0, 1) + '-' + dni.substr(1, 4) + '-' + dni.substr(5, 9);
    },
    formatDate() {
      return date => format(new Date(date), 'dd/MM/yyyy');
    },
    salary() {
      return amount => numeral(amount).format('$0,0.00');
    },
    formatPhone() {
      return phone => phone.substr(0, 4) + '-' + phone.substr(4, 7);
    },
  },
  methods: {
    openUpdateModal() {
      this.$buefy.modal.open({
        parent: this,
        component: ProfileUpdate,
        trapFocus: true,
        width: 850,
        props: {
          userInfo: this.profile,
        },
      });
    },
  },
  // created() {
  //   this.$store.dispatch('');
  //   this.$store.dispatch('');
  // },
};
</script>
