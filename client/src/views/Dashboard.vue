<template>
  <div>
    <Navbar />
    <Admin v-if="auth.user.tipo_empleado == 1" />
    <Employee v-if="auth.user.tipo_empleado != 1" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Navbar from '@/components/Navbar.vue';
import Admin from '@/components/dashboard/Admin.vue';
import Employee from '@/components/dashboard/Employee.vue';

export default {
  name: 'Dashboard',
  components: {
    Navbar,
    Admin,
    Employee,
  },
  computed: {
    ...mapState(['auth']),
  },
};
</script>
