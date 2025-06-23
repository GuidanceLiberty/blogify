import express from 'express';
import { createPost, deletePost, getLikedPosts, getLikePostCountByUser, getPost, getPostCountByUser, getPosts, getSearchPosts, getSinglePost, likeUnlikePost, updatePost } from '../controlers/post.controler.js';
import { verifyToken } from '../middleware/verifyToken.js';


const router = express.Router();

router.get('/search', getSearchPosts);
router.use(verifyToken);

router.get('/', getPosts);
router.post('/', createPost);
router.get('/:slug', getPost);
router.get('/Single-post/:slug', getSinglePost);
router.put('/:slug', updatePost);
router.delete('/:slug', deletePost);
router.post('/like-and-unike-post', likeUnlikePost);
router.get('/likes/:user_id', getLikedPosts);
router.get('/count/:user_id', getPostCountByUser);
router.get('/likes/count/:user_id', getLikePostCountByUser);

export default router;