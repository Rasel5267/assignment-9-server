import express from 'express';
import { AdminController } from './admin.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  AdminController.GetAllAdmins
);

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  AdminController.GetAdminById
);

router.patch(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  AdminController.UpdateAdmin
);

router.patch('/:id/role', auth(ENUM_USER_ROLE.SUPER_ADMIN), AdminController.ManageRoles);

router.delete('/:id', auth(ENUM_USER_ROLE.SUPER_ADMIN), AdminController.DeleteAdmin);

export const AdminRoutes = router;
