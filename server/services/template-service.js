import axios from "axios";
import { distributePrompts } from "../utils/server-functions.js";

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});

const getRandomTemplate = async (users) => {
  try {
    if (!users) {
      throw new Error("No users found");
    }
    const allTemplates = await instance.get("templates/all")
    const randomIndex = Math.floor(Math.random() * allTemplates.data.length)
    const thisMadLib = allTemplates.data[randomIndex]
    const usernames = users.map(user => user.userName); // Extract usernames from the array of objects
    thisMadLib.assignedPrompts = distributePrompts(thisMadLib.prompts, usernames)
    return thisMadLib
  } catch (error) {
    console.log(error)
    throw error; // Propagate the error up to the calling code
  }
}



export{getRandomTemplate}