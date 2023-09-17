import axios from "axios";

const instance = axios.create({ // This is the axios instance that is used to make requests to the backend
  baseURL: "http://localhost:8000/api",
});

const createNewMadLib = async (req) => { // This function is used to create a new madlib
  try { 
    const newMadLib = await instance.post("/templates/new", req);
    return newMadLib.data;
  } catch (error) {
    throw error.response.data.errors;
  }
};

const getMadLibById = async (madLibId) => { // This function is used to get a madlib by its id
  try {
    const madLib = await instance.get(`/templates/${madLibId}/view`)
    return madLib.data
  } catch (error) {
    console.log(error)
  }
}

const updateMadLibById = async ({madLibId, ...formData}) => { // This function is used to update a madlib by its id
  try {
    const updatedMadLib = await instance.put(`/templates/${madLibId}/edit`, formData);
    console.log(updatedMadLib.data);
    return updatedMadLib.data;
  } catch (error) {}
};

const deleteMadLibById = async (madLibId) => { // This function is used to delete a madlib by its id
  try {
    const deletedMadLib = await instance.delete(`/templates/${madLibId}/delete`)
    return deletedMadLib.data
  } catch (error) {
    console.log(error)
  }
}

export { createNewMadLib, deleteMadLibById, getMadLibById, updateMadLibById };
