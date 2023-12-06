import express from 'express';
import TaskRoutes from './taskRoute.js';

const router = express.Router();
const defaultRoutes = [
  {
    path: '/tasks',
    route: TaskRoutes,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
