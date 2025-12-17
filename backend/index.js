import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import userRoute from './routes/userRoute.js';
import cookieParser from 'cookie-parser';
import messageRoute from './routes/messageRoute.js';
import { app, server } from './socket/socket.js';
import path from "path";

dotenv.config({});
const PORT = process.env.PORT || 8080;

const __dirname = path.resolve();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173','http://localhost:5174'],
    credentials: true,
}));

// routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);
// https://localhost:8080/api/v1/users/register

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, "/frontend/dist")));

// Catch-all route for SPA - send index.html for any non-API routes
app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    } else {
        next();
    }
});

server.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});
