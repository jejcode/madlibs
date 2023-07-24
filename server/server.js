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
        console.log("rooms = ",rooms)
        socket.emit("JOIN_ROOM_ACCEPTED", rooms[roomId]); // sends back array of users in room
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

      socket.on("user_left_room", userInfo => {
        console.log('user left room', userInfo)
        // console.log(userInfo.name, 'has left room', userInfo.roomCode)
        socket.leave(userInfo.roomCode) // removes user from room
        io.to(userInfo.roomCode).emit("new_message", {
          message: `${userInfo.name} has left the chat`,
          name: "Server",
          isNewUser: true,
          roomCode: userInfo.roomCode
        })

        if (rooms[userInfo.roomCode]) { // if room exists
          rooms[userInfo.roomCode] = rooms[userInfo.roomCode].filter(user => user !== userInfo.name) // remove user from room
        }

      })


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
