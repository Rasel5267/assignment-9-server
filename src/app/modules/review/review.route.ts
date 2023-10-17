import express from 'express';
import { ReviewController } from './review.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewValidation } from './review.validation';

const router = express.Router();

router.get('/', ReviewController.GetAllReviews);

router.get('/:id', auth(ENUM_USER_ROLE.CUSTOMER), ReviewController.GetReviewById);

router.post(
  '/',
  validateRequest(ReviewValidation.create),
  auth(ENUM_USER_ROLE.CUSTOMER),
  ReviewController.CreateReview
);

router.patch('/:id', auth(ENUM_USER_ROLE.CUSTOMER), ReviewController.UpdateReview);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER),
  ReviewController.UpdateReview
);

export const ReviewRoutes = router;
