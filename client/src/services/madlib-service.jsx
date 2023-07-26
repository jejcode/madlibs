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

const getMadLibById = async (madLibId) => {
  try {
    const madLib = await instance.get(`/templates/${madLibId}/view`)
    return madLib.data
  } catch (error) {
    console.log(error)
  }
}

const updateMadLibById = async ({madLibId, ...formData}) => {
  try {
    const updatedMadLib = await instance.put(`/templates/${madLibId}/edit`, formData);
    console.log(updatedMadLib.data);
    return updatedMadLib.data;
  } catch (error) {}
};

const deleteMadLibById = async (madLibId) => {
  try {
    const deletedMadLib = await instance.delete(`/templates/${madLibId}/delete`)
    return deletedMadLib.data
  } catch (error) {
    console.log(error)
  }
}

export { createNewMadLib, deleteMadLibById, getMadLibById, updateMadLibById };
