import {Server} from "socket.io";
import http from "http";
import express from "express";
import User from "../models/userModel.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin:[process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:5174'],
        methods:['GET', 'POST'],
        credentials: true
    },
});

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

const userSocketMap = {}; // {userId->socketId}


io.on('connection', (socket)=>{
    const userId = socket.handshake.query.userId
    if(userId !== undefined){
        userSocketMap[userId] = socket.id;
    } 

    io.emit('getOnlineUsers',Object.keys(userSocketMap));

    socket.on('disconnect', async ()=>{
        delete userSocketMap[userId];
        // update last seen time
        try{
            if(userId){
                await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
            }
        }catch(err){
            console.log('Failed to update lastSeen for', userId, err?.message);
        }
        io.emit('getOnlineUsers',Object.keys(userSocketMap));
    })

})

export {app, io, server};
