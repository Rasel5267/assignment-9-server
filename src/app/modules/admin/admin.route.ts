import express from 'express';
import { AdminController } from './admin.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { AdminValidation } from './admin.validation';

const router = express.Router();

router.get('/', auth(ENUM_USER_ROLE.SUPER_ADMIN), AdminController.GetAllAdmins);

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  AdminController.GetAdminById
);

router.patch(
  '/:id',
  validateRequest(AdminValidation.update),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  AdminController.UpdateAdmin
);

router.patch(
  '/:id/role',
  validateRequest(AdminValidation.updateRole),
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  AdminController.ManageRoles
);

router.delete('/:id', auth(ENUM_USER_ROLE.SUPER_ADMIN), AdminController.DeleteAdmin);

export const AdminRoutes = router;
