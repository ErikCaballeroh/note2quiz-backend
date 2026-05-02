import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { createCategoryController, deleteCategoryController, getCategoriesController, getCategoryController, updateCategoryController } from '../controllers/category.controller';

const router = Router();

router.get('/', authMiddleware, getCategoriesController);
router.post('/', authMiddleware, createCategoryController);
router.get('/:id', authMiddleware, getCategoryController);
router.put('/:id', authMiddleware, updateCategoryController);
router.delete('/:id', authMiddleware, deleteCategoryController);

export default router;