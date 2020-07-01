export default [
  {
    path: '/permiso/solicitar',
    name: 'permit-create',
    meta: {
      title: 'Solicitar permiso | Adisj',
      requiresAuth: true,
    },
    component: () => import(/* webpackChunkName: "permit-create" */ '../views/permits/PermitCreate.vue'),
  },
  {
    path: '/permisos',
    name: 'permits',
    meta: {
      title: 'Permisos | Adisj',
      requiresAuth: true,
    },
    component: () => import(/* webpackChunkName: "employees" */ '../views/permits/PermitList.vue'),
  },
  // {
  //   path: '/empleados/:userId',
  //   name: 'employee-show',
  //   meta: {
  //     title: 'Información empleado | Adisj',
  //     requiresAuth: true,
  //     adminOnly: true,
  //   },
  //   component: () => import(/* webpackChunkName: "employee-show" */ '../views/employees/EmployeeShow.vue'),
  //   props: true,
  // },
];
