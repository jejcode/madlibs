import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8000/api'
})

const distributePrompts = (prompts, users) => {
  // const userNameArray
  const assignedPrompts = prompts.reduce((acc, prompt, index) => {
    const promptWithIndex = {
      index: index,
      prompt: prompt
    }
    const user = users[index % users.length].name
    if(!acc[user]) acc[user] = []
    acc[user].push(promptWithIndex)
    return acc
  }, {})
  return assignedPrompts
}

const getRandomTemplate = async (users) => {
  try {
    console.log('services:', users)
    const allTemplates = await instance.get("templates/all")
    const randomIndex = Math.floor(Math.random() * allTemplates.data.length)
    console.log('random number', randomIndex)
    const thisMadLib = allTemplates.data[randomIndex]
    thisMadLib.assignedPrompts = distributePrompts(thisMadLib.prompts, users)
    return thisMadLib
  } catch (error) {
    console.log(error)
  }
}

export{getRandomTemplate}