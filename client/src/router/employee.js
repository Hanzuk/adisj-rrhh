export default [
  {
    path: '/empleados/nuevo',
    name: 'employee-create',
    meta: {
      title: 'Nuevo empleado | Adisj',
      requiresAuth: true,
      adminOnly: true,
    },
    component: () => import(/* webpackChunkName: "employee-create" */ '../views/employees/EmployeeCreate.vue'),
  },
  {
    path: '/empleados',
    name: 'employees',
    meta: {
      title: 'Empleados | Adisj',
      requiresAuth: true,
      adminOnly: true,
    },
    component: () => import(/* webpackChunkName: "employees" */ '../views/employees/EmployeeList.vue'),
  },
  {
    path: '/empleados/:userId',
    name: 'employee-show',
    meta: {
      title: 'Información empleado | Adisj',
      requiresAuth: true,
      adminOnly: true,
    },
    component: () => import(/* webpackChunkName: "employee-show" */ '../views/employees/EmployeeShow.vue'),
    props: true,
  },
];
