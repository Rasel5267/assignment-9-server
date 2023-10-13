import express from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { CustomerRoutes } from '../modules/customer/customer.route';
import { AdminRoutes } from '../modules/admin/admin.route';
import { AuthRoutes } from '../modules/auth/auth.router';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    routes: UserRoutes
  },
  {
    path: '/customers',
    routes: CustomerRoutes
  },
  {
    path: '/admins',
    routes: AdminRoutes
  },
  {
    path: '/auth',
    routes: AuthRoutes
  }
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.routes);
});

export default router;
