import express from 'express';
import { createCategory, deleteCategory, getCategories, getCategory, getCategoryPosts, updateCategory } from '../controlers/category.controler.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();
router.use(verifyToken);


router.get('/', getCategories);
router.post('/', createCategory);
router.get('/:category_id', getCategory);
router.put('/:category_id', updateCategory);
router.delete('/:category_id', deleteCategory);
router.get('/category-posts/:category_id', getCategoryPosts);

export default router;