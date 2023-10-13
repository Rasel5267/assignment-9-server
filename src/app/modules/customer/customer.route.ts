import express from 'express';
import { CustomerController } from './customer.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.get('/', auth(ENUM_USER_ROLE.ADMIN), CustomerController.GetAllCustomers);

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER),
  CustomerController.GetCustomerById
);

router.patch(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER),
  CustomerController.UpdateCustomer
);

router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), CustomerController.DeleteCustomer);

export const CustomerRoutes = router;
