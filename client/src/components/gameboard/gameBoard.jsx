import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { SocketContext } from "../../contexts/socket";
import UniversalInputForm from "../forms/UniversalInputForm";
const GameBoard = () => {
  const { roomId } = useParams();
  const name = sessionStorage.getItem("name");
  const socket = useContext(SocketContext);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameLoaded, setGameLoaded] = useState(false);
  const [gameSolved, setGameSolved] = useState(false);
  const [gameTemplate, setGameTemplate] = useState("");
  const [playerPrompts, setPlayerPrompts] = useState([]);
  const [currentPrompt, setCurrentPrompt] = useState({});

  const startGame = () => {
    console.log("starting game");
    setGameStarted(true);
    socket.emit("start_game", { name, roomId });
  };


  const saveUserInput = (input) => {
    const inputWithIndex = {
      index: currentPrompt.index,
      input: input,
    };
    console.log(inputWithIndex)
    socket.emit("user_submit_prompt", {
      inputWithIndex,
      roomId,
      limit: gameTemplate.prompts.length,
    });
  };

  useEffect(() => {
    socket.on("loading_game", (message) => {
      console.log(message);
      setGameStarted(true);
    });
    socket.on("distribute_madlib", (madlib) => {
      console.log("madlib recieved");
      setGameTemplate(madlib);
      const [firstPrompt, ...remainingPrompts] = madlib.assignedPrompts[name];
      setCurrentPrompt(firstPrompt);
      setPlayerPrompts(remainingPrompts);
      console.log(madlib);
      setGameLoaded(true)
    });
    socket.on("input_received", (res) => {
      console.log('input receiving, getting next prompt...')
      const [firstPrompt, ...remainingPrompts] = playerPrompts;
      console.log('next prompt', firstPrompt)
      console.log('remaining prompts:', remainingPrompts)
      setCurrentPrompt(firstPrompt);
      setPlayerPrompts(remainingPrompts);
    })

    return () => {
      socket.off("loading_game");
      socket.off("distrinute_madlib");
      socket.off("input_recieved")
    };
  }, [socket, currentPrompt]);

  return (
    <div
      id="gameBoard"
      className="d-flex align-items-center justify-content-center border rounded"
    >
      {!gameStarted ? (
        <Button onClick={startGame}>Let's play!</Button>
      ) : (
        <>
          {!gameLoaded ? (
            <p>Loading MadLib prompts...</p>
          ) : (
            <>
              {!gameSolved ? (
                <UniversalInputForm
                  placeHolder={`Enter a(n) ${currentPrompt.prompt}`}
                  setAction={saveUserInput}
                  buttonLabel="Next"
                />
              ) : (
                <div>Game solved</div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default GameBoard;
