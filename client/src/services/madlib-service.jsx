import axios from 'axios'

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});

const createNewMadLib = async (req) => {
  try {
    console.log(req)
    const newMadLib = await instance.post("/templates/new", req)
    return newMadLib.data
    
  } catch (error) {
    console.log(error.response.data.errors)
    throw error.response.data.errors
  }

}

export {createNewMadLib}