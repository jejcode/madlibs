import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
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
  const [userFinished, setUserFinished] = useState(false)

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
  const getNextPrompt = () => {
    setPlayerPrompts((prevPrompts) => {
      const [firstPrompt, ...remainingPrompts] = prevPrompts;
      setCurrentPrompt(firstPrompt);
      return remainingPrompts;
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
      // setCurrentPrompt(firstPrompt);
      // setPlayerPrompts(remainingPrompts);
      // setUserFinished(true)
      if (playerPrompts.length > 0) {
        getNextPrompt();
      } else {
        setUserFinished(true);
      }

    })
    socket.on('all_users_finished', (allUserInputs) => {
      console.log(allUserInputs)
      // convert userInputs into madlib solution
      // madlib.title
      // madlib.body
      // allUserInputs
      // iterate body and replace { } with allUserInputs[index]
      let madLib = gameTemplate.body
      for (let i = 0; i < gameTemplate.prompts.length; i++) {
        madLib = madLib.replace(`{${gameTemplate.prompts[i]}}`, allUserInputs[i].input)
      }
      setGameSolved(madLib)
    })

    return () => {
      socket.off("loading_game");
      socket.off("distrinute_madlib");
      socket.off("input_received")
      socket.off("all_users_finished")
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
                <>
                  {!userFinished ?
                    <UniversalInputForm
                      placeHolder={`Enter a(n) ${currentPrompt.prompt}`}
                      setAction={saveUserInput}
                      buttonLabel="Next"
                    />
                    :
                    <p>Waiting for others to finish...</p>
                  }
                </>
              ) : (
                <Card className="p-3">
                  <h3>{gameTemplate.title}</h3>
                  <p>{gameSolved}</p>
                  <p>MadLib Id: {gameTemplate._id}</p>
                  <Button onClick={startGame}>Play again!</Button>

                </Card>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default GameBoard;
