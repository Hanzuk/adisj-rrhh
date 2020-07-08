<template>
  <div>
    <AdminView v-if="auth.user.tipo_empleado === 1" />
    <!-- <EmployeeView v-if="auth.user.tipo_empleado !== 1" /> -->
  </div>
</template>

<script>
import AdminView from '@/components/travelExpenses/AdminView.vue';
// import EmployeeView from '@/components/travelExpenses/EmployeeView.vue';
import { mapState } from 'vuex';

export default {
  name: 'TravelExpenses',
  components: {
    AdminView,
    // EmployeeView,
  },
  computed: {
    ...mapState(['auth']),
  },
};
</script>
