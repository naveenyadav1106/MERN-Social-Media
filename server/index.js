import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from "cors";
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import { register } from './controllers/auth.js'
import { createPost } from './controllers/posts.js'
import { verifyToken } from './middlware/auth.js';
import User from './models/User.js';
import Post from './models/Post.js'
import { users, posts } from './data/index.js'



// Configuration to obtain the current module's file path
const __filename = fileURLToPath(import.meta.url);

// Configuration to obtain the current module's directory path
const __dirname = path.dirname(__filename);

// Load environment variables from the .env file
dotenv.config();

// Create an instance of the Express application
const app = express();

// Middleware for parsing incoming JSON requests
app.use(express.json());

// Helmet middleware for setting security headers
app.use(helmet());

// Helmet middleware for Cross-Origin Resource Policy header    
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

// Morgan middleware for logging HTTP requests
app.use(morgan("common"));

// Body-parser middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// CORS middleware for enabling Cross-Origin Resource Sharing
app.use(cors());



// Serve static files from the 'public/assets' directory for the '/assets' route
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));



// File storage configuration using Multer
const storage = multer.diskStorage({
    // Specify the destination directory for storing uploaded files
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    // Specify the filename for uploaded files
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Create an instance of Multer with the configured storage settings
const upload = multer({ storage });



//Routes with files
app.post("/auth/register", upload.single("picture"), register);
app.post('/posts', verifyToken, upload.single("picture"), createPost);

//ROUTES
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use("/posts", postRoutes);

//Mongoose set up
const PORT = process.env.PORT || 6001;

mongoose.connect(process.env.Mongo_url)
    .then(() => {
        app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

        // ADD DATA ONE TIME
        // User.insertMany(users);
        // Post.insertMany(posts);
    })
    .catch((error) => console.log(`${error} did not connect`))
