<template>
  <div>
    <Navbar />
    <AdminView v-if="auth.user.tipo_empleado === 1" />
    <EmployeeView v-if="auth.user.tipo_empleado !== 1" />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import AdminView from '@/components/congrats/AdminView.vue';
import EmployeeView from '@/components/congrats/EmployeeView.vue';
import { mapState } from 'vuex';

export default {
  name: 'Congrats',
  components: {
    Navbar,
    AdminView,
    EmployeeView,
  },
  computed: {
    ...mapState(['auth']),
  },
};
</script>
