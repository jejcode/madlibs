import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  body: { 
    type: String, 
    required: [true, "Message is required"],
    maxlength: [150, "Max length of 150 characters"]
  },
  owner: {
    // type: mongoose.Schema.Types.ObjectId,
    type: String,
    required: [true, "Messages need an owner"]
  },
  room: {
    type: String,
    required: [true, "Room is required"]
  }

});

const Message = mongoose.model("Message", MessageSchema);
export default Message;
