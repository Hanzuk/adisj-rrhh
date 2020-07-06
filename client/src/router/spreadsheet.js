export default [
  {
    path: '/calcular-salario',
    name: 'payroll',
    meta: {
      title: 'Calcular salario | Adisj',
      requiresAuth: true,
      adminOnly: true,
    },
    component: () => import(/* webpackChunkName: "payroll" */ '../views/spreadsheet/Payroll.vue'),
  },
  {
    path: '/retenciones-salariales',
    name: 'withholding',
    meta: {
      title: 'Retenciones salariales | Adisj',
      requiresAuth: true,
      adminOnly: true,
    },
    component: () => import(/* webpackChunkName: "withholding" */ '../views/spreadsheet/Withholding.vue'),
  },
  {
    path: '/aumentos-salariales',
    name: 'increases',
    meta: {
      title: 'Aumentos salariales | Adisj',
      requiresAuth: true,
      adminOnly: true,
    },
    component: () => import(/* webpackChunkName: "increases" */ '../views/spreadsheet/Increase.vue'),
    props: true,
  },
  {
    path: '/incapacidades',
    name: 'handicaps',
    meta: {
      title: 'Incapacidades | Adisj',
      requiresAuth: true,
      adminOnly: true,
    },
    component: () => import(/* webpackChunkName: "handicaps" */ '../views/spreadsheet/Handicaps.vue'),
    props: true,
  },
];
