// Import necessary modules
import express from 'express';
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import "dotenv/config";

// Route handlers
import Hello from "./Hello.js";
import Lab5 from "./Lab5.js";
import CourseRoutes from "./Kanbas/courses/routes.js";
import ModuleRoutes from "./Kanbas/modules/routes.js";
import UserRoutes from "./Users/routes.js";

// Database connection
const CONNECTION_STRING = process.env.DB_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/kanbas';
mongoose.connect(CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

// Express application setup
const app = express();

// Session configuration
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {}
};

if (process.env.NODE_ENV === "production") {
    app.set('trust proxy', 1); // Trust first proxy
    sessionOptions.cookie.secure = true; // Serve secure cookies
    sessionOptions.cookie.sameSite = 'none';
}

app.use(session(sessionOptions));

// CORS configuration to handle credentials and multiple allowed origins
const allowedOrigins = [
    'https://a6--wonderful-souffle-8a3a6c.netlify.app',
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Middleware for parsing JSON
app.use(express.json());

// Initialize routes
ModuleRoutes(app);
CourseRoutes(app);
Lab5(app);
Hello(app);
UserRoutes(app);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Server listening
app.listen(process.env.PORT || 4000, () => {
    console.log(`Server is running on port ${process.env.PORT || 4000}`);
});
