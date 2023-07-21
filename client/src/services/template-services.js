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

export {createTemplate}
