import express from 'express';
import { DestinationController } from './destination.controller';
import validateRequest from '../../middlewares/validateRequest';
import { DestinationValidation } from './destination.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.get('/', DestinationController.GetAllDestinations);

router.get('/:id', DestinationController.GetDestinationById);

router.post(
  '/',
  validateRequest(DestinationValidation.create),
  auth(ENUM_USER_ROLE.ADMIN),
  DestinationController.CreateDestination
);

router.patch(
  '/:id',
  validateRequest(DestinationValidation.update),
  auth(ENUM_USER_ROLE.ADMIN),
  DestinationController.UpdateDestination
);

router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), DestinationController.DeleteDestination);

export const DestinationRoutes = router;
