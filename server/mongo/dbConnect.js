import mongoose from "mongoose";

// connect to DB using mongoose and log a message if successful
async function dbConnect() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/madlibsDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Established a connection to the database");
    mongoose.connection.on("error", () => {
      throw new Error("Could not connect to DB.");
    });
  } catch (error) {
    console.log(error)
  }
}

export default dbConnect