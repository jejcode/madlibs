import axios from 'axios'

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});

const createNewMadLib = async (req, res) => {
  try {
    const newMadLib = await instance.post("templates/new", req.body)
    return newMadLib.data
    
  } catch (error) {
    console.log(error)
    return res.json(error)
  }

}

export {createNewMadLib}