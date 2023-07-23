import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import dbConnect from "./mongo/dbConnect.js";

const app = express();

// Enable CORS for the Express server to accept requests from http://localhost:5173
app.use(cors({ origin: "http://localhost:5173" }));

// Parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function serverStart() {
  try {
    await dbConnect();
    const PORT = 8000;
    const server = app.listen(PORT, () =>
      console.log(`Server is running on port ${PORT}`)
    );

    // Set up socket.io server with CORS configuration
    const io = new Server(server, {
      cors: {
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST"],
        allowedHeaders: ["*"],
        credentials: true,
      },
    });

    const rooms = {}; // room#: [userNames]
    // socket.io event listeners
    io.on("connection", (socket) => {
      // Generates random room code,
      // creates a key:value pair in rooms {roomCode: [array of user names in that room]}
      // and returns the room code to the client for navigation
      socket.on("CREATE_ROOM_REQUEST", (reqName) => {
        const generateRoomCode = () => {
          const makeKey = () => {
            return Math.random().toString(36).substring(2, 8).toUpperCase();
          };
          const newKey = makeKey();
          while (newKey == rooms[newKey]) {
            newKey = makeKey();
          }
          return newKey;
        };
        const newRoomCode = generateRoomCode();
        rooms[newRoomCode] = [reqName];
        console.log('generated room key:', newRoomCode)
        socket.join(newRoomCode)
        socket.emit("CREATE_ROOM_SUCCESS", newRoomCode);
      });
      socket.on("REQUEST_TO_JOIN_ROOM", info => {
        const {roomId} = info
        if(!rooms[roomId]){
          socket.emit("ROOM_REQUEST_DENIED", false)
        } else {
          socket.emit("ROOM_REQUEST_ACCEPTED", roomId)
        }
      })
      socket.on("USER_JOINED_ROOM", info => {
        const {roomId, name} = info
        if(!rooms[roomId]) {
          rooms[roomId] = [name]
        } else if (rooms[roomId].indexOf(name) === -1) {
          rooms[roomId].push(name)
        }
        console.log(rooms[roomId])
        socket.to(roomId).emit("JOIN_ROOM_ACCEPTED", rooms[roomId])
      })
    });
  } catch (error) {
    console.log(error);
  }
}

serverStart();
