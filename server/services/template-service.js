import axios from "axios";
import { distributePrompts } from "../utils/server-functions.js";

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});



const getRandomTemplate = async (users) => {
  try {
    const allTemplates = await instance.get("templates/all")
    const randomIndex = Math.floor(Math.random() * allTemplates.data.length)
    const thisMadLib = allTemplates.data[randomIndex]
    thisMadLib.assignedPrompts = distributePrompts(thisMadLib.prompts, users)
    return thisMadLib
  } catch (error) {
    console.log(error)
  }
}

export{getRandomTemplate}