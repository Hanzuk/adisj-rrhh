<template>
  <div>
    <AdminView v-if="auth.user.tipo_empleado === 1" />
    <EmployeeView v-if="auth.user.tipo_empleado !== 1" />
  </div>
</template>

<script>
import AdminView from '@/components/congrats/AdminView.vue';
import EmployeeView from '@/components/congrats/EmployeeView.vue';
import { mapState } from 'vuex';

export default {
  name: 'Congrats',
  components: {
    AdminView,
    EmployeeView,
  },
  computed: {
    ...mapState(['auth']),
  },
};
</script>
