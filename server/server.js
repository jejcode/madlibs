import express from "express";
import cors from "cors";
import dbConnect from "./config/mongoose.config.js";
import templateRouter from "./routes/template.routes.js";
import { Server } from "socket.io";

const app = express();

// Enable CORS for the Express server to accept requests from http://localhost:5173
app.use(cors({ origin: 'http://localhost:5173' }));

// Parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up routes
app.use("/api/templates", templateRouter);

const serverStart = async () => {
  try {
    await dbConnect();
    const PORT = 8000;
    const server = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    
    // Set up Socket.IO server with CORS configurations
    const io = new Server(server, {
      cors: {

        origin: ['http://localhost:3000', 'http://localhost:5173'], // Allow requests from both origins
        methods: ['GET', 'POST'],
        allowedHeaders: ['*'],
        credentials: true,
      }
    });
    
    // Socket.IO event listeners
    io.on("connection", socket => {
      console.log('socket id: ' + socket.id);
      socket.emit("Welcome", "Welcome to the server");
    
      socket.on("join_room", (roomCode) => { // roomCode = "room code"
        socket.join(roomCode);
        console.log(`User with ID: ${socket.id} joined room: ${roomCode}`);
      });
    
      socket.on("new_user", (data) => { // data = { name: "user name", roomCode: "room code" }
        console.log(data.name);
        io.to(data.roomCode).emit("new_message", { isNewUser: true, text: `${data.name} has joined the chat` });
      });
    
      socket.on("new_message", (data) => { // data = { message: { text: "message text", name: "user name" }, roomCode: "room code" }
        console.log(data.name, data.message, data.roomCode);
        io.to(data.roomCode).emit("new_message", { ...data.message, isNewUser: false }); 
      });
    
      socket.on("disconnect", () => {
        console.log('User disconnected: ' + socket.id);
        socket.broadcast.emit("new_message", { text: `User ${socket.id} has left the chat` });
      });
    });
  } catch (err) {
    console.log(err);
  }
};

serverStart();
