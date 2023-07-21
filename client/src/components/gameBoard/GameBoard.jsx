import React, {useContext, useEffect, useState} from "react";
import { UserContext } from "../UserContext";
import { useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button'

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
const GameBoard = ({socket}) => {
  const [loaded, setLoaded] = useState(false)
  const [solved, setSolved] = useState(false)
  const [assignedPrompts, setAssignedPrompts] = useState({})
  const [userResponses, setUserResponses] = useState([])

  const {roomCode} = useParams()
  const {madLib, setMadlib} = useContext(UserContext)

  const beginGame = () => {
    socket.emit('new_game', roomCode) // request gameboard from server
    setLoaded(true)
  }
  useEffect(() => {
    socket.on('prompts_loaded', madLib => {
        console.log('current madLib:', madLib)
        setMadlib(madLib)
        setLoaded(true)
    })
  })
  return (
    <>
      {loaded ? 
        <div>loaded</div>
        :
        <div>
          <Button onClick={beginGame}>Let's Play!</Button>
        </div>
      }
    </>
  )
}

export default GameBoard