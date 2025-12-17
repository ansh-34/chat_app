import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";


export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;
        let gotConversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });
        if (!gotConversation) {
            gotConversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        };
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message,
            seen: false,
        });
        if (newMessage) {
            // Ensure messages is an array (schema change may not have populated it for old docs)
            if (!Array.isArray(gotConversation.messages)) {
                gotConversation.messages = [];
            }
            gotConversation.messages.push(newMessage._id);
        }
        await Promise.all([gotConversation.save(), newMessage.save()]);
        //Socket.io
        const recieverSocketId = getReceiverSocketId(receiverId);
        if (recieverSocketId) {
            io.to(recieverSocketId).emit("newMessage", newMessage);
        }


        return res.status(200).json({newMessage: newMessage });
    } catch (error) {
        console.log("Error in sendMessage controller:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getMessage = async (req, res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.id;
        // Mark messages from receiver -> current user as seen
        const unseenMessages = await Message.find({
            senderId: receiverId,
            receiverId: senderId,
            seen: false,
        }).select('_id');

        if (unseenMessages.length > 0) {
            const unseenIds = unseenMessages.map(m => m._id);
            await Message.updateMany(
                { _id: { $in: unseenIds } },
                { seen: true, seenAt: new Date() }
            );

            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("messagesSeen", { messageIds: unseenIds, seenBy: senderId });
            }
        }

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        }).populate({
            path: 'messages',
            select: 'senderId receiverId message createdAt seen seenAt',
        });

        const messages = conversation?.messages || [];
        return res.status(200).json({ messages });
    } catch (error) {
        console.log("Error in getMessages controller:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}