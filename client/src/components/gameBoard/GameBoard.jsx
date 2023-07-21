import React, {useEffect, useState} from "react";
import { getRandomTemplate } from "../../services/template-services";

const distributePrompts = (prompts, users) => {
  const assignedPrompts = prompts.reduce((acc, prompt, index) => {
    const promptWithIndex = {
      index: index,
      prompt: prompt
    }
    const user = users[index % users.length]
    if(!acc[user]) acc[user] = []
    acc[user].push(promptWithIndex)
    return acc
  }, {})
  return assignedPrompts
}
const GameBoard = (props) => {
  const {users} = props
  const [loaded, setLoaded] = useState(false)
  const [solved, setSolved] = useState(false)
  const [assignedPrompts, setAssignedPrompts] = useState({})
  const [userResponses, setUserResponses] = useState([])
  useEffect(() => {
    (async () => {
      try {
        const madLib = await getRandomTemplate()
        setAssignedPrompts(distributePrompts(madLib.prompts, users))
        setLoaded(true)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])
  return (
    <>
      {loaded && 
        <div>
          
        </div>
      }
    </>
  )
}

export default GameBoard