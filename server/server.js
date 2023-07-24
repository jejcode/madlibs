import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import dbConnect from "./mongo/dbConnect.js";
import templateRouter from "./routes/template.routes.js";
import { generateRoomCode } from "./utils/server-functions.js";
const app = express();

// Enable CORS for the Express server to accept requests from http://localhost:5173
app.use(cors({ origin: "http://localhost:5173" }));

// Parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up routes
app.use("/api/templates", templateRouter);

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
    const users = {} // room#: [userNames]
    // socket.io event listeners
    io.on("connection", (socket) => {
      // Generates random room code,
      // creates a key:value pair in rooms {roomCode: [array of user names in that room]}
      // and returns the room code to the client for navigation
      socket.on("CREATE_ROOM_REQUEST", (reqName) => {
        
        const newRoomCode = generateRoomCode();
        rooms[newRoomCode] = [reqName];
        console.log('generated room key:', newRoomCode)
        socket.join(newRoomCode)
        socket.emit("CREATE_ROOM_SUCCESS", newRoomCode);
        socket.emit("JOIN_ROOM_ACCEPTED", rooms[newRoomCode]);
      });
      socket.on("REQUEST_TO_JOIN_ROOM", info => {
        const { roomId } = info
        if (!rooms[roomId]) {
          socket.emit("ROOM_REQUEST_DENIED", false)
        } else {
          socket.join(roomId);
          socket.emit("ROOM_REQUEST_ACCEPTED", roomId)
        }
      })
      socket.on("USER_JOINED_ROOM", info => {
        const { roomId, name } = info
        if (!rooms[roomId]) {
          rooms[roomId] = [name]
        } else if (rooms[roomId].indexOf(name) === -1) {
          rooms[roomId].push(name)
        }
        console.log(rooms[roomId])
        socket.to(roomId).emit("JOIN_ROOM_ACCEPTED", rooms[roomId])
        if (rooms[roomId].includes(name)) {
          io.to(roomId).emit("new_message", {
            message: `${name} has joined the chat`,
            name: "Server",
            isNewUser: true,
            roomCode: roomId,
          });
        }
      })

      socket.on("new_message", (data) => {
        console.log(data.name, data.message, data.roomCode);
        io.to(data.roomCode).emit("new_message", {
          message: data.message,
          name: data.name,
          isNewUser: false
        });
      });

      // When a user explicitly leaves a room
      socket.on("user_left_room", userInfo => {
        const { name, roomCode } = userInfo;

        // Remove the user from the room
        if (rooms[roomCode]) {
          rooms[roomCode] = rooms[roomCode].filter(user => user !== name);
        }

        // Notify the other users in the room
        io.to(roomCode).emit("new_message", {
          message: `${name} has left the chat`,
          name: "Server",
          isNewUser: true,
          roomCode
        });
      });

      // When a user disconnects
      socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);

        // Find the room the user was in
        for (let room in rooms) {
          let index = rooms[room].indexOf(socket.id);

          // If the user was in this room
          if (index !== -1) {
            // Remove the user from the room
            rooms[room].splice(index, 1);

            // If the room is now empty, delete it
            if (rooms[room].length === 0) {
              delete rooms[room];
            }

            // Notify the other users in the room
            io.to(room).emit("new_message", {
              message: `${socket.id} has left the chat`,
              name: "Server",
              isNewUser: true,
              roomCode: room
            });

            // Stop looking for the user's room
            break;
          }
        }
      });



    });
  } catch (error) {
    console.log(error);
  }
}

serverStart();
