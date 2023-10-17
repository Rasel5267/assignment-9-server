import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { TourPackageValidation } from './tourPackage.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { TourPackageController } from './tourPackage.controller';

const router = express.Router();

router.get('/', TourPackageController.GetAllTourPackages);

router.get('/:id', TourPackageController.GetTourPackageById);

router.post(
  '/',
  validateRequest(TourPackageValidation.create),
  auth(ENUM_USER_ROLE.ADMIN),
  TourPackageController.CreateTourPackage
);

router.patch(
  '/:id',
  validateRequest(TourPackageValidation.update),
  auth(ENUM_USER_ROLE.ADMIN),
  TourPackageController.UpdateTourPackage
);

router.patch(
  '/:id',
  validateRequest(TourPackageValidation.updateStatus),
  auth(ENUM_USER_ROLE.ADMIN),
  TourPackageController.UpdateTourPackageStatus
);

router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), TourPackageController.DeleteTourPackage);

export const TourPackageRoutes = router;
