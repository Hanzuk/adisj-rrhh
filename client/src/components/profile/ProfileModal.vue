<template>
  <div class="box">
    <h5 class="title is-4">Actualizar mi información</h5>
    <ValidationObserver ref="observer" v-slot="{ invalid }" tag="div" class="columns is-multiline">
      <ValidationProvider
        :rules="{ required: true, dni: /^[0-9]{1}-[0-9]{4}-[0-9]{4}$/ }"
        v-slot="{ errors, valid }"
        tag="div"
        class="column"
      >
        <b-field label="Cédula" :message="errors" :type="{ 'is-danger': errors[0], 'is-success': valid }" expanded>
          <b-input v-model="dni" v-cleave="masks.dni" @input.native="setRawDNI"></b-input>
        </b-field>
      </ValidationProvider>

      <ValidationProvider
        :rules="{ required: true, alpha_spaces: /^[a-zA-Z\s]*$/ }"
        v-slot="{ errors, valid }"
        tag="div"
        class="column"
      >
        <b-field label="Nombre" :message="errors" :type="{ 'is-danger': errors[0], 'is-success': valid }" expanded>
          <b-input v-model="name"></b-input>
        </b-field>
      </ValidationProvider>

      <ValidationProvider
        :rules="{ required: true, alpha_spaces: /^[a-zA-Z\s]*$/ }"
        v-slot="{ errors, valid }"
        tag="div"
        class="column"
      >
        <b-field
          label="Primer apellido"
          :message="errors"
          :type="{
            'is-danger': errors[0],
            'is-success': valid,
          }"
          expanded
        >
          <b-input v-model="fLastname"></b-input>
        </b-field>
      </ValidationProvider>

      <ValidationProvider
        :rules="{ required: true, alpha_spaces: /^[a-zA-Z\s]*$/ }"
        v-slot="{ errors, valid }"
        tag="div"
        class="column"
      >
        <b-field
          label="Segundo apellido"
          :message="errors"
          :type="{
            'is-danger': errors[0],
            'is-success': valid,
          }"
          expanded
        >
          <b-input v-model="sLastname"></b-input>
        </b-field>
      </ValidationProvider>

      <ValidationProvider rules="required" v-slot="{ errors, valid }" tag="div" class="column is-full">
        <b-field label="Fecha de nacimiento" :message="errors" :type="{ 'is-danger': errors[0], 'is-success': valid }">
          <b-datepicker
            v-model="bornDate"
            :day-names="dayNames"
            :month-names="monthNames"
            :first-day-of-week="1"
            :date-formatter="date => date.toLocaleDateString('es-CR')"
            placeholder="Seleccionar fecha..."
          >
          </b-datepicker>
        </b-field>
      </ValidationProvider>

      <ValidationProvider rules="required" v-slot="{ errors }" tag="div" class="column is-full">
        <b-field label="Provincia" :message="errors" :type="{ 'is-danger': errors[0] }">
          <b-select v-model="province" placeholder="Selecciona uno" expanded>
            <option v-for="province in catalogue.provinces" :key="province.codigo" :value="province.codigo">
              {{ province.nombre }}
            </option>
          </b-select>
        </b-field>
      </ValidationProvider>

      <ValidationProvider rules="required" v-slot="{ errors }" tag="div" class="column is-full">
        <b-field label="Cantón" :message="errors" :type="{ 'is-danger': errors[0] }">
          <b-select v-model="canton" placeholder="Selecciona uno" expanded>
            <option v-for="canton in cantones" :key="canton.codigo" :value="canton.codigo">
              {{ canton.nombre }}
            </option>
          </b-select>
        </b-field>
      </ValidationProvider>

      <ValidationProvider rules="required" v-slot="{ errors }" tag="div" class="column is-full">
        <b-field label="Distrito" :message="errors" :type="{ 'is-danger': errors[0] }">
          <b-select v-model="district" placeholder="Selecciona uno" expanded>
            <option v-for="district in districts" :key="district.codigo" :value="district.codigo">
              {{ district.nombre }}
            </option>
          </b-select>
        </b-field>
      </ValidationProvider>

      <ValidationProvider
        :rules="{ required: true, address: /^[a-zA-Z0-9 .,]*$/ }"
        v-slot="{ errors, valid }"
        tag="div"
        class="column is-full"
      >
        <b-field
          label="Dirección exacta"
          :message="errors"
          :type="{
            'is-danger': errors[0],
            'is-success': valid,
          }"
        >
          <b-input v-model="address" maxlength="200"></b-input>
        </b-field>
      </ValidationProvider>

      <div class="column is-full">
        <b-field label="Números de teléfono"></b-field>
        <p class="mb-5">Actuales (Selecciona los que quieras eliminar)</p>
        <div class="block">
          <b-checkbox v-model="oldPhones" v-for="phone in userInfo.telefonos" :key="phone.id" :native-value="phone.id">
            {{ phone.numero }}
          </b-checkbox>
        </div>
      </div>

      <div class="column is-full">
        <b-field label="Nuevos"></b-field>
        <div class="columns">
          <ValidationProvider rules="required" v-slot="{ errors }" tag="div" class="column is-3">
            <b-field :message="errors" :type="{ 'is-danger': errors[0] }" expanded>
              <b-select v-model="type" placeholder="Tipo" expanded>
                <option value="1">Celular</option>
                <option value="2">Casa</option>
              </b-select>
            </b-field>
          </ValidationProvider>

          <ValidationProvider
            :rules="{ required: true, phone: /^\+506\s{1}[0-9]{4}-[0-9]{4}$/ }"
            v-slot="{ errors, valid }"
            tag="div"
            class="column is-6"
          >
            <b-field :message="errors" :type="{ 'is-danger': errors[0], 'is-success': valid }" expanded>
              <b-input v-model="phone" v-cleave="masks.custom" @input.native="setRawPhone" expanded></b-input>
            </b-field>
          </ValidationProvider>

          <div class="column is-3">
            <b-button class="button is-primary" @click="addPhone" expanded>Agregar</b-button>
          </div>
        </div>

        <b-field grouped group-multiline>
          <div v-for="(phone, key) in phones" :key="phone.id" class="control">
            <b-tag type="is-primary" size="is-medium" attached closable @close="removePhone(phones, key)">
              {{ phone.toShow }}
            </b-tag>
          </div>
        </b-field>
      </div>

      <div class="column is-full">
        <div class="buttons is-pulled-right">
          <b-button type="is-light" @click="$parent.close()">Cancelar</b-button>
          <b-button type="is-primary" :disabled="invalid" @click="updateInfo">Actualizar</b-button>
        </div>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
import Service from '@/services/AdisjService.js';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { mapState } from 'vuex';
import { formatISO } from 'date-fns';

export default {
  name: 'ProfileModal',
  props: {
    userInfo: Object,
  },
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      dni: '',
      rawDNI: '',
      name: this.userInfo.nombre,
      fLastname: this.userInfo.p_apellido,
      sLastname: this.userInfo.s_apellido,
      bornDate: new Date(this.userInfo.fecha_nacimiento),
      province: null,
      canton: null,
      district: null,
      address: this.userInfo.direccion.direccion,
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
      type: null,
      phone: '',
      oldPhones: [],
      phones: [],
      rawPhone: '',
      nextPhoneId: 0,
      masks: {
        custom: {
          prefix: '+506',
          delimiters: [' ', '-', '-'],
          blocks: [4, 4, 4],
          numericOnly: true,
          rawValueTrimPrefix: true,
        },
        dni: {
          delimiters: ['-', '-', '-'],
          blocks: [1, 4, 4],
          numericOnly: true,
          rawValueTrimPrefix: true,
        },
      },
    };
  },
  computed: {
    ...mapState({
      catalogue: state => state.employees.addressCatalogue,
    }),
    cantones() {
      return this.catalogue.cantones.filter(item => item.codigo_provincia === this.province);
    },
    districts() {
      return this.catalogue.districts.filter(item => item.codigo_canton === this.canton);
    },
  },
  methods: {
    setRawDNI(event) {
      this.rawDNI = event.target._vCleave == undefined ? this.dni : event.target._vCleave.getRawValue();
    },
    addPhone() {
      if (this.phone === '' || this.rawPhone.length < 8) {
        this.$buefy.toast.open({
          duration: 2000,
          message: 'Ingresa número de teléfono',
          position: 'is-bottom-left',
          type: 'is-danger',
        });

        return;
      }

      if (this.phones.findIndex(phone => phone.phone === this.rawPhone) < 0) {
        this.phones.push({
          id: this.nextPhoneId++,
          phone: this.rawPhone,
          toShow: this.phone,
          type: parseInt(this.type),
        });

        return;
      }

      this.$buefy.toast.open({
        duration: 2000,
        message: 'Ya agregaste este número de teléfono',
        position: 'is-bottom-left',
        type: 'is-danger',
      });
    },
    removePhone(phones, key) {
      this.$delete(phones, key);
      this.phones.splice(key);
    },
    removeOldPhone(key, e) {
      console.log(e);
      this.oldPhones.push(key);
    },
    setRawPhone(event) {
      this.rawPhone = event.target._vCleave.getRawValue();
    },

    async updateInfo() {
      try {
        await Service.profileUpdate({
          cedula: this.rawDNI,
          nombre: this.name,
          p_apellido: this.fLastname,
          s_apellido: this.sLastname,
          fecha_nacimiento: formatISO(new Date(this.bornDate), { representation: 'date' }),
          codigo_provincia: this.province,
          codigo_canton: this.canton,
          codigo_distrito: this.district,
          direccion: this.address,
          telefonos: this.phones.map(phone => {
            return { numero: phone.phone, tipo_telefono: phone.type };
          }),
          oldPhones: this.oldPhones,
        });

        this.$parent.close();

        this.$buefy.toast.open({
          duration: 2500,
          message: 'Tu Información ha sido actualizada.',
          type: 'is-success',
        });
      } catch (error) {
        console.log(error);
        this.$buefy.toast.open({
          duration: 2000,
          message: 'No se pudo actualizar la informacion',
          position: 'is-bottom-left',
          type: 'is-danger',
        });
      }
    },
  },
  created() {
    this.dni =
      this.userInfo.cedula.substring(0, 1) +
      '-' +
      this.userInfo.cedula.substring(1, 5) +
      '-' +
      this.userInfo.cedula.substring(5, 9);
    this.rawDNI = this.userInfo.cedula;
    this.province = this.catalogue.provinces.find(e => e.nombre == this.userInfo.direccion.provincia).codigo;
    this.canton = this.catalogue.cantones.find(e => e.nombre == this.userInfo.direccion.canton).codigo;
    this.district = this.catalogue.districts.find(e => e.nombre == this.userInfo.direccion.distrito).codigo;
  },
};
</script>
