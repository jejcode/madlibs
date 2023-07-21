import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8000/api'
})

const getRandomTemplate = async () => {
  try {
    const allTemplates = await instance.get("templates/all")
    const randomIndex = Math.floor(Math.random() * allTemplates.data.length)
    console.log('random number', randomIndex)
    return allTemplates.data[randomIndex]
  } catch (error) {
    console.log(error)
  }
}

export{getRandomTemplate}