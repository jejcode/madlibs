import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./config/mongoose.config.js";
import madlibRouter from "./routes/madlib.routes.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(cors({ origin: 'http://localhost:5173' }));

// direct routes need to come after middleware
app.use("/api/madlibs", madlibRouter);

const serverStart = async () => {
  try {
    await dbConnect();
    // const PORT = process.env.DB_PORT;
    const PORT = 8000;
    app.listen(PORT, () => console.log("Database is loaded."));
  } catch (err) {
    console.log(err);
  }
};

await serverStart();
