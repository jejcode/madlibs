import axios from "axios";
import { distributePrompts } from "../utils/server-functions.js";

const instance = axios.create({ 
  baseURL: "http://localhost:8000/api", 
});

// Get a random template from the database
const getRandomTemplate = async (users) => { 
  try { 
    if (!users) { // If no users are provided, throw an error
      throw new Error("No users found");
    }
    const allTemplates = await instance.get("templates/all") // Get all templates from the database
    const randomIndex = Math.floor(Math.random() * allTemplates.data.length) // Get a random index
    const thisMadLib = allTemplates.data[randomIndex] // Get the template at that index
    const usernames = users.map(user => user.userName); // Extract usernames from the array of objects
    thisMadLib.assignedPrompts = distributePrompts(thisMadLib.prompts, usernames) // Distribute prompts to users
    return thisMadLib // Return the template with prompts assigned to users
  } catch (error) { // If there is an error, log it and throw it up to the calling code
    console.log(error)
    throw error; // Propagate the error up to the calling code
  }
}




export{getRandomTemplate}