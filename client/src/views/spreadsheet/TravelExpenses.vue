<template>
  <div>
    <Navbar />
    <AdminView v-if="auth.user.tipo_empleado === 1" />
    <EmployeeView v-if="auth.user.tipo_empleado !== 1" />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import AdminView from '@/components/travelExpenses/AdminView.vue';
import EmployeeView from '@/components/travelExpenses/EmployeeView.vue';
import { mapState } from 'vuex';

export default {
  name: 'TravelExpenses',
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
