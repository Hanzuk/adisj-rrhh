export default [
  {
    path: '/nueva-tarea',
    name: 'new-task',
    meta: {
      title: 'Nueva tarea | Adisj',
      requiresAuth: true,
      adminOnly: true,
    },
    component: () => import(/* webpackChunkName: "new-task" */ '../views/tasks/TaskCreate.vue'),
  },
  {
    path: '/tareas',
    name: 'tasks',
    meta: {
      title: 'Tareas | Adisj',
      requiresAuth: true,
    },
    component: () => import(/* webpackChunkName: "tasks" */ '../views/tasks/TaskList.vue'),
  },
];
