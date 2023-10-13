import express from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { CustomerRoutes } from '../modules/customer/customer.route';
import { AdminRoutes } from '../modules/admin/admin.route';
import { AuthRoutes } from '../modules/auth/auth.router';
import { DestinationRoutes } from '../modules/destination/destination.route';
import { TourPackageRoutes } from '../modules/tourPackage/tourPackage.route';

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
  },
  {
    path: '/destinations',
    routes: DestinationRoutes
  },
  {
    path: '/tour-packages',
    routes: TourPackageRoutes
  }
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.routes);
});

export default router;
