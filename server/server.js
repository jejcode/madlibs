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

// Object to store active rooms and their user counts
const activeRooms = {};

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
    
      socket.on("create_room", (roomCode) => {
        // Check if the room code is already in activeRooms
        if (activeRooms[roomCode]) {
          socket.emit("room_creation_error", "Room code already exists");
        } else {
          // Add the room code to activeRooms with an initial user count of 0
          activeRooms[roomCode] = { userCount: 0 };
          socket.emit("room_created", roomCode);
        }
      });
    
      socket.on("join_room", (roomCode) => {
        // Check if the room code exists in activeRooms
        if (activeRooms[roomCode]) {
          socket.join(roomCode);
          console.log(`User with ID: ${socket.id} joined room: ${roomCode}`);
    
          // Increment the user count for the room
          activeRooms[roomCode].userCount++;
    
          // Emit the room_exists event to indicate that the room exists
          socket.emit("room_exists", true);
        } else {
          // Room code does not exist, handle the error
          console.log(`Invalid room code: ${roomCode}`);
          socket.emit("room_join_error", "Room does not exist");
    
          // Emit the room_exists event to indicate that the room does not exist
          socket.emit("room_exists", false);
        }
      });
    
      socket.on("new_user", (data) => {
        console.log("new_user;", data.name);
        io.to(data.roomCode).emit("new_message", {
          message: `${data.name} has joined the chat`,
          name: "Server",
          roomCode: data.roomCode,
        });
      });

      socket.on("new_message", (data) => { 
        console.log(data.name, data.message, data.roomCode);
        io.to(data.roomCode).emit("new_message", { 
          message: data.message, 
          name: data.name, 
          isNewUser: false });
      });

      socket.on("disconnect", () => {
        console.log('User disconnected: ' + socket.id);

        // Get the list of rooms the user is currently in
        const rooms = Object.keys(socket.rooms);

        // Decrement the user count for each room the user is in
        rooms.forEach(roomCode => {
          if (activeRooms[roomCode]) {
            activeRooms[roomCode].userCount--;

            // If the user count becomes zero, remove the room from activeRooms
            if (activeRooms[roomCode].userCount === 0) {
              delete activeRooms[roomCode];
            }
          }
        });

        socket.broadcast.emit("new_message", { text: `User ${socket.id} has left the chat` });
      });
    });
  } catch (err) {
    console.log(err);
  }
};

serverStart();
