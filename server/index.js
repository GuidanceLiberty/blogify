import express from 'express';
import dotenv from 'dotenv';
import authRoute from './route/auth.route.js';
import categoryRoute from './route/category.route.js';
import tagRoute from './route/tag.route.js';
import postRoute from './route/post.route.js';
import commentRoute from './route/comment.routh.js'
import connectDB from './db/connectDB.js';

import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';


dotenv.config();

const app = express();

app.use(cors({origin: "http://localhost:3000", credentials: false}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/tag', tagRoute);
app.use('/api/posts', postRoute);
app.use('/api/comments', commentRoute);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'uploads'),
    limits: { fileSize: 2 * 1024 * 1024 },
    filename: (req, file, cb) => { cb(null, `${file.originalname}`) },
})

const upload = multer({ storage });

app.post(`/api/upload`, upload.single('file'), (req, res) => {
    if(!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    return res.json({ message: 'No file uploaded', path: req.file.path });
})

//HANDLE ERROR
app.use((err, req, res, next) => {
    if(err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ success: false, message: 'File size is too large' });
    }

    next(err);
});

//SERVE UPLOAD FOLDER
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = process.env.PORT || 6000;
app.listen(port, () => {
    connectDB();
    console.log(`server running on port http://localhost:${port}`);
})