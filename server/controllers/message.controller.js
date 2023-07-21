import Message from "../models/message.model";

const createMessage = async (req, res) => {
  try {
    const newMessage = Message.create(req.body)
    return res.json(newMessage)
    return 
  } catch (error) {
    console.log(error)
  }
}
export {}