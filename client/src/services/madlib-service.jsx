import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});

const createNewMadLib = async (req) => {
  try {
    const newMadLib = await instance.post("/templates/new", req);
    return newMadLib.data;
  } catch (error) {
    throw error.response.data.errors;
  }
};

const updateMadLibById = async (madLibId) => {
  try {
    const updatedMadLib = await instance.put(`/templates/${madLibId}/edit`);
    console.log(updatedMadLib.data);
    return updatedMadLib.data;
  } catch (error) {}
};

export { createNewMadLib, updateMadLibById };
