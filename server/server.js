import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import dbConnect from "./mongo/dbConnect.js";
import templateRouter from "./routes/template.routes.js";
import { distributePrompts, generateRoomCode } from "./utils/server-functions.js";
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


    const users = {} // room#: [{userName, colorSelected, socketId}]
    const madlibs = {} // room#: [input objects {index, input}]
    const assignedPrompts = {}; // room#: {userName: [prompts]}
    const completedPrompts = {}; // room#: {userName: [prompts]}



    io.on("connection", (socket) => {

      socket.on("CREATE_ROOM_REQUEST", (reqName, reqColor) => {
        const newRoomCode = generateRoomCode(users); // generate a new room code
        users[newRoomCode] = [{ userName: reqName, colorSelected: reqColor, socketId: socket.id }]; // add user to room
        console.log('generated room key:', newRoomCode)
        socket.join(newRoomCode) // join the room
        socket.emit("CREATE_ROOM_SUCCESS", newRoomCode); // send the room code back to the client
        socket.emit("JOIN_ROOM_ACCEPTED", users[newRoomCode]); // send the user list back to the client
      });


      socket.on("REQUEST_TO_JOIN_ROOM", info => {
        const { roomId } = info // get the room code
        if (!users[roomId]) {
          socket.emit("ROOM_REQUEST_DENIED", false) // if the room doesn't exist, send back a message
        } else {
          socket.join(roomId); // join the room
          socket.emit("ROOM_REQUEST_ACCEPTED", roomId)
        }
      })

      socket.on('RANDOM_ROOM_REQUEST', (reqName, reqColor) => {
        const roomCodes = Object.keys(users)
        if (roomCodes.length === 0) {
          socket.emit("ROOM_REQUEST_DENIED", "No rooms available");
        } else {
          const randomRoomCode = roomCodes[Math.floor(Math.random() * roomCodes.length)]
          users[randomRoomCode].push({ userName: reqName, colorSelected: reqColor, socketId: socket.id }) // add user to room
          socket.join(randomRoomCode)
          socket.emit("ROOM_REQUEST_ACCEPTED", randomRoomCode)
        }
      })


      socket.on("USER_JOINED_ROOM", info => {
        const { roomId, name, color } = info;
        if (!name) {
          socket.emit("JOIN_ROOM_DENIED", false);
          return;
        }
        if (!users[roomId]) {
          users[roomId] = [{ userName: name, colorSelected: color, socketId: socket.id }]; // add user to room
        } else {
          const userExists = users[roomId].some(user => user.socketId === socket.id); // check if user already exists in room
          if (!userExists) {
            users[roomId].push({ userName: name, colorSelected: color, socketId: socket.id }); // add user to room
          }
        }

        if (madlibs[roomId]) {
          socket.emit("GAME_IN_PROGRESS", true)
        }
        socket.emit("JOIN_ROOM_ACCEPTED", users[roomId]); // send the user list back to the client
        socket.to(roomId).emit("JOIN_ROOM_ACCEPTED", users[roomId]); // send the user list back to the client
        if (users[roomId].some(user => user.socketId === socket.id)) { // if the user is in the room
          io.to(roomId).emit("new_message", { // send a message to the room
            message: `${name} has joined the chat`,
            name: "Server",
            isNewUser: true,
            roomCode: roomId,
          });
        }
      });

      socket.on("new_message", (data) => {
        console.log(data.name, data.message, data.roomCode);
        io.to(data.roomCode).emit("new_message", {
          message: data.message,
          name: data.name,
          isNewUser: false
        });
      });
      socket.on("CHECK_FOR_USER_IN_ROOMS", userName => {
        for (const room in users) {
          const userExists = users[room].some(user => user.socketId === socket.id);
          if (userExists) {
            console.log('user left room', userName)
            socket.leave(room)
            io.to(room).emit("new_message", {
              message: `${userName} has left the chat`,
              name: "Server",
              isNewUser: true,
              roomCode: room
            })
            if (users[room]) {
              users[room] = users[room].filter(user => user.socketId !== socket.id)
            }
            const roomLength = users[room] ? users[room].length : 0;
            if (roomLength === 0) {
              delete users[room];
            }
            io.to(room).emit("JOIN_ROOM_ACCEPTED", users[room] || []);
          }
        }
      })
      socket.on("user_left_room", userInfo => {
        console.log('user left room', userInfo)
        if (users[userInfo.roomCode]) { // if the room exists
          const user = users[userInfo.roomCode].find(user => user.socketId === socket.id); // get the user
          if (user) { // if the user exists
            let userAssignedPrompts;
            if (assignedPrompts[userInfo.roomCode]) {
              userAssignedPrompts = assignedPrompts[userInfo.roomCode][user.userName];
            }
            // get the user's assigned prompts
            console.log('userAssignedPrompts', userAssignedPrompts)
            let userCompletedPrompts;
            if (completedPrompts[userInfo.roomCode]) {
              userCompletedPrompts = completedPrompts[userInfo.roomCode][user.userName];
            }

            console.log('userCompletedPrompts', userCompletedPrompts)
            if (userAssignedPrompts && userCompletedPrompts && userAssignedPrompts.length !== userCompletedPrompts.length) {

              console.log(`User ${user.userName} left before completing their prompts.`);
              // assign the user's prompts to another user
              const otherUsers = users[userInfo.roomCode].filter(user => user.socketId !== socket.id); // get the other users in the room
              console.log('otherUsers', otherUsers)
              //Distribtute the prompts to the other users

              const leftOverPrompts = userAssignedPrompts.reduce((arr, prompt) => { // get the prompts that the user has not completed
                const prompter = userCompletedPrompts.find(completedPrompt => completedPrompt.index === prompt.index); // check if the prompt is in the user's completed prompts
                if (!prompter) {
                  arr.push(prompt); // if the prompt is not in the user's completed prompts, add it to the leftOverPrompts array
                }
                return arr; // return the array
              }, [])
              console.log('leftOverPrompts', leftOverPrompts)

              if (leftOverPrompts.length > 0) {
                const newPromptList = leftOverPrompts.reduce((obj, prompt, index) => { // assign the prompts to the other users
                  const currentUser = users[userInfo.roomCode][index % users[userInfo.roomCode].length] // get the current user
                  if (!obj[currentUser.userName]) { // if the user does not exist in the object, add them
                    obj[currentUser.userName] = []
                  } else {
                    obj[currentUser.userName].push(prompt) // if the user exists in the object, add the prompt to their array
                  }
                  return obj;
                }, {})

                console.log('newPromptList', newPromptList)
                io.to(userInfo.roomCode).emit("left_over_prompts", newPromptList) // send the new prompts to the users
                assignedPrompts[userInfo.roomCode] = leftOverPrompts.assignedPrompts; // save the assigned prompts to the assignedPrompts object

              }
            }

            if (users[userInfo.roomCode]) { // if the room exists
              users[userInfo.roomCode] = users[userInfo.roomCode].filter(user => user.socketId !== socket.id) // remove the user from the room
            }
            const roomLength = users[userInfo.roomCode] ? users[userInfo.roomCode].length : 0; // get the length of the room
            if (roomLength === 0) { // if the room is empty
              delete users[userInfo.roomCode]; // delete the room
            }
            io.to(userInfo.roomCode).emit("JOIN_ROOM_ACCEPTED", users[userInfo.roomCode] || []); // send the updated room to the users
          }
        }
      });



      socket.on("disconnect", () => {
        console.log('user disconnected', socket.id)
        for (let roomId in users) { // for each room
          let roomUsers = users[roomId]; // get the users in the room
          if (roomUsers.some(user => user.socketId === socket.id)) { // if the user is in the room
            let disconnectedUser = roomUsers.find(user => user.socketId === socket.id); // get the disconnected user
            const userAssignedPrompts = assignedPrompts[roomId][disconnectedUser.userName]; // get the user's assigned prompts
            const userCompletedPrompts = completedPrompts[roomId][disconnectedUser.userName]; // get the user's completed prompts
            if (userAssignedPrompts.length !== userCompletedPrompts.length) { // if the user has not completed all of their prompts
              console.log(`User ${disconnectedUser.userName} left before completing their prompts.`);
            }
            // assign the user's prompts to another user
            const otherUsers = users[userInfo.roomCode].filter(user => user.socketId !== socket.id); // get the other users in the room
            //Distribtute the prompts to the other users
            for (let i = 0; i < userAssignedPrompts.length; i++) { // for each of the user's assigned prompts
              const randomUserIndex = Math.floor(Math.random() * otherUsers.length); // get a random user index
              const randomUser = otherUsers[randomUserIndex]; // get the random user
              if (!assignedPrompts[userInfo.roomCode][randomUser.userName]) { // if the random user does not have any assigned prompts
                assignedPrompts[userInfo.roomCode][randomUser.userName] = []; // create an empty array for the random user's assigned prompts
              }
              assignedPrompts[userInfo.roomCode][randomUser.userName].push(userAssignedPrompts[i]); // assign the prompt to the random user
              otherUsers.splice(randomUserIndex, 1); // remove the random user from the other users array
            }
            delete assignedPrompts[roomId][disconnectedUser.userName];
            delete completedPrompts[roomId][disconnectedUser.userName];
            // Remove the user from the room
            users[roomId] = roomUsers.filter(user => user.socketId !== socket.id);

            // Notify other users in the room
            io.to(roomId).emit("new_message", {
              message: `${disconnectedUser.userName} has left the chat`,
              name: "Server",
              isNewUser: true,
              roomCode: roomId
            });

            // Update the user list for the room
            io.to(roomId).emit("JOIN_ROOM_ACCEPTED", users[roomId] || []);

            // If the room is empty, delete it
            if (users[roomId].length === 0) {
              delete users[roomId];
            }
            break;
          }
        }
      });


      // game play sockets
      socket.on("start_game", async ({ name, roomId }) => {
        try {
          io.to(roomId).emit("new_message", {
            message: `${name} started the game!`,
            name: name,
            isNewUser: true
          })
          io.to(roomId).emit("loading_game", "Loading game...") // send a message to the room that the game is loading

          const completeMadlib = await getRandomTemplate(users[roomId]) // get a random template

          console.log("Here is the Madlib", completeMadlib)
          io.to(roomId).emit("distribute_madlib", completeMadlib) // send the template to the room
          assignedPrompts[roomId] = completeMadlib.assignedPrompts; // save the assigned prompts to the assignedPrompts object
          console.log("Assigned Prompts", assignedPrompts)

          if (!assignedPrompts[roomId]) { // if the room doesn't exist in the assignedPrompts object, create it
            assignedPrompts[roomId] = {}; // create the room
          }
          assignedPrompts[roomId][name] = completeMadlib.assignedPrompts; // add the user's assigned prompts to the room
          console.log("2nd Assigned Prompts", assignedPrompts);
        } catch (error) { // if there is an error, log it
          console.log(error);
        }
      });



      socket.on("user_submit_prompt", ({ inputWithIndex, roomId, limit }) => {
        // madlibs[roomId].push(inputWithIndex) // add the user's input to the madlibs object
        console.log('user submitted input')
        if (!madlibs[roomId]) { // if the room doesn't exist in the madlibs object, create it
          madlibs[roomId] = [inputWithIndex]
        } else { // if the room does exist in the madlibs object, add the user's input to the room
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