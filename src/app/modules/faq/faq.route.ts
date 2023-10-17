import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { FAQValidation } from './faq.validation';
import auth from '../../middlewares/auth';
import { FAQController } from './faq.controller';

const router = express.Router();

router.get('/', FAQController.GetAllFAQ);

router.get('/:id', FAQController.GetFAQById);

router.post(
  '/',
  validateRequest(FAQValidation.create),
  auth(ENUM_USER_ROLE.ADMIN),
  FAQController.CreateFAQ
);

router.patch(
  '/:id',
  validateRequest(FAQValidation.update),
  auth(ENUM_USER_ROLE.ADMIN),
  FAQController.UpdateFAQ
);

router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), FAQController.DeleteFAQ);

export const FAQRoutes = router;
