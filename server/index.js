import express from 'express';
import dotenv from 'dotenv';
import authRoute from './route/auth.route.js';
import categoryRoute from './route/category.route.js';
import tagRoute from './route/tag.route.js';
import postRoute from './route/post.route.js';
import commentRoute from './route/comment.routh.js';
import connectDB from './db/connectDB.js';

import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import cloudinary from './utils/cloudinary.js'; // ✅ Make sure this file exists

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: false }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/tag', tagRoute);
app.use('/api/posts', postRoute);
app.use('/api/comments', commentRoute);

// Required for path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer temp storage (Cloudinary will handle the permanent one)
const upload = multer({ dest: 'temp/' });

// ✅ Upload image to Cloudinary
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'blogify', // Optional: you can rename or remove the folder
    });

    // Delete temp file after upload
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Handle errors
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res
      .status(413)
      .json({ success: false, message: 'File size is too large' });
  }
  next(err);
});

const port = process.env.PORT || 9000;
app.listen(port, () => {
  connectDB();
  console.log(`Server running on http://localhost:${port}`);
});
