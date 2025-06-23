import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { addComment, getCommentCountByUser, getComments } from "../controlers/comment.controler.js";

const router = express.Router();

router.get('/:post_id', getComments);
router.post('/', addComment);
router.get('/count/:user_id', getCommentCountByUser);

export default router;