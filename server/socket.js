
import { Server as socketIoServer } from "socket.io";
import Messages from "./models/MessageModel.js";

const setupSocket = (server) => {

    const io = new socketIoServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
        },
    })

    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log(`client disconnected: ${socket.id}`)
        for(const [userId, socketId] of userSocketMap.entries()){
            if(socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    }

    const sendMessage = async (message) => {
        const senderSocketId = userSocketMap.get(message.sender)
        const recipinentSocketId = userSocketMap.get(message.recipinent)

        const createdMessage = await Messages.create(message)
        const messageData = await Messages.findById(createdMessage._id)
        .populate("sender", "id email firstName lastName color")
        .populate("recipinent", "id email firstName lastName color")

        if(recipinentSocketId) {
            io.to(recipinentSocketId).emit("recieveMessage", messageData)
        }
        if(senderSocketId) {
            io.to(senderSocketId).emit("recieveMessage", messageData)
        }
    }

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        if(userId) {
            userSocketMap.set(userId, socket.id)
            console.log(`user connected : ${userId} with socket ID : ${socket.id}`)
        }else{
            console.log("user id not provided durig connection")
        }

        socket.on("sendMessage", sendMessage);
        socket.on("disconnect", () => disconnect(socket))
    })

}

export default setupSocket;