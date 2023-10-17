import express from 'express';
import { OrderController } from './order.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidation } from './order.validation';

const router = express.Router();

router.get('/', auth(ENUM_USER_ROLE.ADMIN), OrderController.GetAllOrders);

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER),
  OrderController.GetOrderById
);

router.post(
  '/',
  validateRequest(OrderValidation.create),
  auth(ENUM_USER_ROLE.CUSTOMER),
  OrderController.CreateOrder
);

router.patch('/:id', auth(ENUM_USER_ROLE.ADMIN), OrderController.UpdateOrderStatus);

router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), OrderController.DeleteOrder);

export const OrderRoutes = router;
