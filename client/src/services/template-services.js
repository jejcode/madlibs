import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});

const createTemplate = async (madLib) => {
  try {
    const newTemplate = await instance.post("templates/new", madLib);
    return newTemplate.data;
  } catch (error) {
    console.log(error);
  }
};

const getRandomTemplate = async () => {
  try {
    const allTemplates = await instance.get("templates/all")
    console.log(allTemplates)
    const randomIndex = Math.floor(Math.random() * allTemplates.data.length)
    console.log('random number', randomIndex)
    return allTemplates.data[randomIndex]
  } catch (error) {
    console.log(error)
  }
}

export {createTemplate, getRandomTemplate}
