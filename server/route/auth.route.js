import express from 'express';
import { checkAuth, forgotPassword, getUsers, login, logout, resetPassword, signup, verifyEmail } from '../controlers/auth.controler.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/check-auth', verifyToken, checkAuth);
router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
// router.get('/profile/:user_id', getProfile);
router.post('/logout', logout);


router.get('/', getUsers);

export default router;