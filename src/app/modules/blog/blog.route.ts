import express from 'express';
import { BlogController } from './blog.controller';
import validateRequest from '../../middlewares/validateRequest';
import { BlogValidation } from './blog.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.get('/', BlogController.GetAllBlogs);

router.get('/:id', BlogController.GetBlogById);

router.post(
  '/',
  validateRequest(BlogValidation.create),
  auth(ENUM_USER_ROLE.ADMIN),
  BlogController.CreateBlog
);

router.patch(
  '/:id',
  validateRequest(BlogValidation.update),
  auth(ENUM_USER_ROLE.ADMIN),
  BlogController.UpdateBlog
);

router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), BlogController.DeleteBlog);

export const BlogRoutes = router;
