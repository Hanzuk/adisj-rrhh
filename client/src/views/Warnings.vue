<template>
  <div>
    <AdminView v-if="auth.user.tipo_empleado === 1" />
    <EmployeeView v-if="auth.user.tipo_empleado !== 1" />
  </div>
</template>

<script>
import AdminView from '@/components/warnings/AdminView.vue';
import EmployeeView from '@/components/warnings/EmployeeView.vue';
import { mapState } from 'vuex';

export default {
  name: 'Warnings',
  components: {
    AdminView,
    EmployeeView,
  },
  computed: {
    ...mapState(['auth']),
  },
};
</script>
