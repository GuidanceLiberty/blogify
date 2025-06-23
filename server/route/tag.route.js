import express from 'express';
import { createTag, deleteTag, getTag, getTags, updateTag } from '../controlers/tag.controler.js';

const router = express.Router();

router.get('/', getTags);
router.post('/', createTag);
router.get('/:tag_id', getTag);
router.put('/:tag_id', updateTag);
router.delete('/:tag_id', deleteTag);

export default router;