import express from "express";
import cors from "cors";
import dbConnect from "./config/mongoose.config.js";
import templateRouter from "./routes/template.routes.js";
import { Server } from "socket.io";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:5173' }));

app.use("/api/templates", templateRouter);

const serverStart = async () => {
  try {
    await dbConnect();
    const PORT = 8000;
    // app.listen(PORT, () => console.log("Database is loaded.")); // remove this line
  } catch (err) {
    console.log(err);
  }
};

const server = app.listen(8000, () => console.log(`Server is running on port 8000`));

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['*'],
    credentials: true,
  }
});

io.on("connection", socket => {
  console.log('socket id: ' + socket.id);
  console.log(`Nice to meet you,(shake hand)`);
  socket.emit("Welcome", "Welcome to the server");

  socket.on("new_user", name => {
      console.log(name);
      socket.broadcast.emit("new_message", { isNewUser: true, text: `${name} has joined the chat` });
  });

  socket.on("new_message", message => {
      console.log(message);
      io.emit("new_message", { ...message, isNewUser: false });
  });

  socket.on("disconnect", () => {
    console.log('User disconnected: ' + socket.id);
    socket.broadcast.emit("new_message", { text: `User ${socket.id} has left the chat` });
  });
});

await serverStart();
