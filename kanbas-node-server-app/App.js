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
mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });

// Express application setup
const app = express();

// Session configuration
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {}
};

if (process.env.NODE_ENV !== "development") {
    sessionOptions.cookie = {
        sameSite: "none",
        secure: true,
        domain: process.env.HTTP_SERVER_DOMAIN,
    };
    sessionOptions.proxy = true;
}

app.use(session(sessionOptions));

// CORS configuration to handle credentials
app.use(cors({
    origin: 'https://a6--wonderful-souffle-8a3a6c.netlify.app', // Set to the exact origin of the client
    credentials: true // Allow credentials
}));

// Middleware
app.use(express.json());

// Routes
ModuleRoutes(app);
CourseRoutes(app);
Lab5(app);
Hello(app);
UserRoutes(app);

// Server listening
app.listen(process.env.PORT || 4000, () => {
    console.log(`Server is running on port ${process.env.PORT || 4000}`);
});
