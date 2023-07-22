import React, {useContext, useEffect, useState} from "react";
import { UserContext } from "../UserContext";
import { useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button'
import PlayerInputForm from "./PlayerInputForm";

const GameBoard = ({socket}) => {
  const [loaded, setLoaded] = useState(false)
  const [solved, setSolved] = useState(false)
  const [assignedPrompts, setAssignedPrompts] = useState({})
  const [userResponses, setUserResponses] = useState([])

  const {roomCode} = useParams()
  const {madLib, setMadlib, name} = useContext(UserContext)

  const beginGame = () => {
    socket.emit('new_game', roomCode) // request gameboard from server
    setLoaded(true)
  }
  useEffect(() => {
    socket.on('prompts_loaded', madLib => {
        console.log('current madLib:', madLib)
        setMadlib(madLib)
        if(madLib.assignedPrompts[name]) {
          setAssignedPrompts(madLib.assignedPrompts[name])
        }

        console.log(madLib.assignedPrompts)
        setLoaded(true)
    })
  })
  return (
    <>
      {loaded ? 
      <>
        {solved ?
          <Button onClick={beginGame}>Play again</Button>
        :
          <PlayerInputForm prompts={assignedPrompts} setSolved={setSolved} setUserResponses={setUserResponses}/>
      }
      </>
        :
        <div>
          <Button onClick={beginGame}>Let's Play!</Button>
        </div>
      }
    </>
  )
}

export default GameBoard