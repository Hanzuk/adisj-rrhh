<template>
  <div class="contact-info">
    <h1 class="title is-4">Información de contacto</h1>
    <h2 class="subtitle is-6">
      Ingresa los datos de domicilio y teléfonos
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
        :rules="{ required: true, address: /^[a-zA-ZA-zÀ-ú0-9.,\s]*$/ }"
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
      <ValidationProvider rules="required|phone:8" v-slot="{ errors }" tag="div" class="column is-6">
        <b-field :message="errors" :type="{ 'is-danger': errors[0] }" expanded>
          <b-input v-model="phone" @input="sendDataToParent" maxlength="8" expanded></b-input>
        </b-field>
      </ValidationProvider>

      <div class="column is-3">
        <b-button class="button is-primary" @click="addPhone" :disabled="invalid" expanded>Agregar</b-button>
      </div>
    </ValidationObserver>

    <b-field v-for="(phone, key) in phones" :key="phone.id">
      <p class="control">
        <span class="button is-static">
          <b-icon :icon="phone.type === 1 ? 'cellphone-iphone' : 'phone-classic'"></b-icon>
        </span>
      </p>
      <p class="control">
        <span class="button is-static">{{ phone.phone }}</span>
      </p>
      <p class="control">
        <b-button type="is-danger" @click="$delete(phones, key)" icon-right="delete" />
      </p>
    </b-field>
  </div>
</template>

<script>
// import { required, numeric, minLength, helpers } from 'vuelidate/lib/validators';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { mapState } from 'vuex';

// const spacedAlphaNum = helpers.regex('spacedAlphaNum', );

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
      phones: [],
      province: null,
      canton: null,
      district: null,
      address: '',
      nextPhoneId: 0,
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
      this.phones.push({
        id: this.nextPhoneId++,
        phone: this.phone,
        type: parseInt(this.type),
      });
      this.sendDataToParent();
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
