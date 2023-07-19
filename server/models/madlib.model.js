import mongoose from "mongoose";

const MadlibSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, "Title is required"] 
  },
  body: {
    type: String,
    required: [True, "Body text is required"]
  }

});

const Madlib = mongoose.model("Madlib", MadlibSchema);
export default Madlib;
