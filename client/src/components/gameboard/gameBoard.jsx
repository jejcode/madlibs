import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { SocketContext } from "../../contexts/socket";
import UniversalInputForm from "../forms/UniversalInputForm";
const GameBoard = () => {
  const {roomId} = useParams()
  const name = sessionStorage.getItem("name");
  const [roomUsers, setAllRoomUsers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameLoaded, setGameLoaded] = useState(false)
  const [gameSolved, setGameSolved] = useState(false);
  const [gameTemplate, setGameTemplate] = useState('')
  const [playerPrompts, setPlayerPrompts] = useState([]);
  const socket = useContext(SocketContext);

  const startGame = () => {
    console.log("starting game");
    setGameStarted(true);
    socket.emit("start_game", {name, roomId})
  };

  useEffect(() => {
    socket.on("loading_game", message => {
      console.log(message)
      setGameStarted(true)
    })
    socket.on("distribute_prompts", promptsObj => {
      console.log(promptsObj[name])
    })
  }, [socket])

  return (
    <div id="gameBoard" className="d-flex align-items-center justify-content-center border rounded">
      {!gameStarted ? 
        <Button onClick={startGame}>Let's play!</Button>
      :
        <>
          {!gameLoaded ? 
            <p>Loading MadLib prompts...</p>
            :
            <>
            {!gameSolved ?
            <UniversalInputForm />
            :
            <div>Game solved</div>
          }
            </>
          }
        </>
      }
    </div>
  );
};

export default GameBoard;
