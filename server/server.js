import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import dbConnect from "./mongo/dbConnect.js";
import templateRouter from "./routes/template.routes.js";
import { generateRoomCode } from "./utils/server-functions.js";
import { getRandomTemplate } from "./services/template-service.js";
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
    const madlibs = {} // room#: [input objects {index, input}]
    io.on("connection", (socket) => {
      socket.on("CREATE_ROOM_REQUEST", (reqName, reqColor) => {
        const newRoomCode = generateRoomCode(users);
        users[newRoomCode] = [{ userName: reqName, colorSelected: reqColor }];
        console.log('generated room key:', newRoomCode)
        socket.join(newRoomCode)
        socket.emit("CREATE_ROOM_SUCCESS", newRoomCode);
        socket.emit("JOIN_ROOM_ACCEPTED", users[newRoomCode]);
      });

      socket.on("REQUEST_TO_JOIN_ROOM", info => {
        const { roomId } = info
        if (!users[roomId]) {
          socket.emit("ROOM_REQUEST_DENIED", false)
        } else {
          socket.join(roomId);
          socket.emit("ROOM_REQUEST_ACCEPTED", roomId)
        }
      })

      socket.on('RANDOM_ROOM_REQUEST', (reqName, reqColor) => {
        const roomCodes = Object.keys(users)
        if (roomCodes.length === 0) {
          socket.emit("ROOM_REQUEST_DENIED", "No rooms available");
        } else {
          const randomRoomCode = roomCodes[Math.floor(Math.random() * roomCodes.length)]
          users[randomRoomCode].push({ userName: reqName, colorSelected: reqColor }) 
          socket.join(randomRoomCode)
          socket.emit("ROOM_REQUEST_ACCEPTED", randomRoomCode)
        }
      })

      socket.on("USER_JOINED_ROOM", info => {
        const { roomId, name, color } = info
        if(!name) {
          socket.emit("JOIN_ROOM_DENIED", false)
          return
        }
        if (!users[roomId]) {
          users[roomId] = [{ userName: name, colorSelected: color }];
        } else {
          const userExists = users[roomId].some(user => user.userName === name);
          if (!userExists) {
            users[roomId].push({ userName: name, colorSelected: color });
          }
        }
        console.log("users = ", users)
        socket.emit("JOIN_ROOM_ACCEPTED", users[roomId]);
        socket.to(roomId).emit("JOIN_ROOM_ACCEPTED", users[roomId])
        if (users[roomId].some(user => user.userName === name)) {
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
        socket.leave(userInfo.roomCode)
        io.to(userInfo.roomCode).emit("new_message", {
          message: `${userInfo.name} has left the chat`,
          name: "Server",
          isNewUser: true,
          roomCode: userInfo.roomCode
        })
        if (users[userInfo.roomCode]) {
          users[userInfo.roomCode] = users[userInfo.roomCode].filter(user => user.userName !== userInfo.name)
        }
        const roomLength = users[userInfo.roomCode] ? users[userInfo.roomCode].length : 0;
        if (roomLength === 0) {
          delete users[userInfo.roomCode];
        }
        io.to(userInfo.roomCode).emit("JOIN_ROOM_ACCEPTED", users[userInfo.roomCode] || []);
      });



    // game play sockets
    socket.on("start_game", async ({ name, roomId }) => {
      try {
        io.to(roomId).emit("new_message", {
          message: `${name} started the game!`,
          name: name,
          isNewUser: true
        })
        io.to(roomId).emit("loading_game", "Loading game...")
        const completeMadlib = await getRandomTemplate(users[roomId])
        console.log(completeMadlib)
        io.to(roomId).emit("distribute_madlib", completeMadlib)
      } catch (error) {
        console.log(error);
      }
    })

    socket.on("user_submit_prompt", ({ inputWithIndex, roomId, limit }) => {
      console.log('user submitted input')
      if (!madlibs[roomId]) {
        madlibs[roomId] = [inputWithIndex]
      } else {
        madlibs[roomId].push(inputWithIndex)
      }
      console.log(madlibs[roomId])
      if (madlibs[roomId].length == limit) {
        // send responses to everybody in the room and remove them from storage
        io.to(roomId).emit('all_users_finished', madlibs[roomId]);
        delete madlibs[roomId]
      } else {
        // send permission to continue
        socket.emit('input_received', true)
      }
    })

    socket.on("RESET_GAME", ({ name, roomId }) => {
      // Reset the game state for the room
      if (madlibs[roomId]) {
        madlibs[roomId] = [];
      }
      io.to(roomId).emit("RESET_GAME", { name, roomId });
    });


  });
} catch (error) {
  console.log(error);
}
}

serverStart();