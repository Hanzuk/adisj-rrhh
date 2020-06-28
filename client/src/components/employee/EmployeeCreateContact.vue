<template>
  <div>
    <h1 class="title is-4">Información de contacto</h1>
    <h2 class="subtitle is-6">
      Completa los datos de domicilio e ingresa números de teléfono
    </h2>
    <div class="columns">
      <ValidationProvider rules="required" v-slot="{ errors }" tag="div" class="column">
        <b-field label="Provincia" :message="errors" :type="{ 'is-danger': errors[0] }">
          <b-select v-model="province" @input="sendDataToParent" placeholder="Selecciona uno" expanded>
            <option v-for="province in catalogue.provinces" :key="province.codigo" :value="province.codigo">
              {{ province.nombre }}
            </option>
          </b-select>
        </b-field>
      </ValidationProvider>
    </div>

    <div class="columns">
      <ValidationProvider rules="required" v-slot="{ errors }" tag="div" class="column">
        <b-field label="Cantón" :message="errors" :type="{ 'is-danger': errors[0] }">
          <b-select v-model="canton" @input="sendDataToParent" placeholder="Selecciona uno" expanded>
            <option v-for="canton in cantones" :key="canton.codigo" :value="canton.codigo">
              {{ canton.nombre }}
            </option>
          </b-select>
        </b-field>
      </ValidationProvider>
    </div>

    <div class="columns">
      <ValidationProvider rules="required" v-slot="{ errors }" tag="div" class="column">
        <b-field label="Distrito" :message="errors" :type="{ 'is-danger': errors[0] }">
          <b-select v-model="district" @input="sendDataToParent" placeholder="Selecciona uno" expanded>
            <option v-for="district in districts" :key="district.codigo" :value="district.codigo">
              {{ district.nombre }}
            </option>
          </b-select>
        </b-field>
      </ValidationProvider>
    </div>

    <div class="columns">
      <ValidationProvider
        :rules="{ required: true, address: /^[a-zA-Z0-9 .,]*$/ }"
        v-slot="{ errors, valid }"
        tag="div"
        class="column"
      >
        <b-field
          label="Dirección exacta"
          :message="errors"
          :type="{
            'is-danger': errors[0],
            'is-success': valid,
          }"
        >
          <b-input v-model="address" @input="sendDataToParent" maxlength="200" type="textarea"></b-input>
        </b-field>
      </ValidationProvider>
    </div>

    <b-field label="Números de teléfono"></b-field>
    <ValidationObserver ref="observer" v-slot="{ invalid }" tag="div" class="columns">
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
          <b-input
            v-model="phone"
            @input="sendDataToParent"
            v-cleave="masks.custom"
            @input.native="setRawPhone"
            expanded
          ></b-input>
        </b-field>
      </ValidationProvider>

      <div class="column is-3">
        <b-button class="button is-primary" @click="addPhone" :disabled="invalid" expanded>Agregar</b-button>
      </div>
    </ValidationObserver>

    <b-field grouped group-multiline>
      <div v-for="(phone, key) in phones" :key="phone.id" class="control">
        <b-tag type="is-primary" size="is-medium" attached closable @close="removePhone(phones, key)">
          {{ phone.toShow }}
        </b-tag>
      </div>
    </b-field>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { mapState } from 'vuex';

export default {
  name: 'EmployeeContact',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      type: null,
      phone: '',
      rawPhone: '',
      phones: [],
      province: null,
      canton: null,
      district: null,
      address: '',
      nextPhoneId: 0,
      masks: {
        custom: {
          prefix: '+506',
          delimiters: [' ', '-', '-'],
          blocks: [4, 4, 4],
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
    addPhone() {
      console.log(this.phones.findIndex(phone => phone.phone === this.rawPhone));

      if (this.phones.findIndex(phone => phone.phone === this.rawPhone) < 0) {
        this.phones.push({
          id: this.nextPhoneId++,
          phone: this.rawPhone,
          toShow: this.phone,
          type: parseInt(this.type),
        });
        return this.sendDataToParent();
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
      this.sendDataToParent();
    },
    setRawPhone(event) {
      this.rawPhone = event.target._vCleave.getRawValue();
    },
    sendDataToParent() {
      this.$emit('contact-data', {
        telefonos: this.phones.map(phone => {
          return { numero: phone.phone, tipo_telefono: phone.type };
        }),
        direccion: {
          provincia: this.province,
          canton: this.canton,
          distrito: this.district,
          direccion: this.address,
        },
      });
    },
  },
};
</script>
