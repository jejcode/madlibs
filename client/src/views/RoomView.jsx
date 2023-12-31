import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams, useBeforeUnload } from "react-router-dom";
import ChatView from "./ChatView";
import UserList from "../components/room/UserList";
import { SocketContext } from "../contexts/socket";
import GameBoard from "../components/gameboard/gameBoard";
import { UserContext } from "../contexts/users";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import madLibBanner from "../assets/madLibBanner.png";
import { useNavigate } from "react-router-dom";

const RoomView = () => {
  const navigate = useNavigate();
  console.log("session storage name:", sessionStorage.getItem("name"));
  console.log("local storage name:", localStorage.getItem("name"));
  if (!sessionStorage.getItem("name")) {
    sessionStorage.getItem("name", localStorage.getItem("name)"));
    localStorage.removeItem("name");
  }
  const name = sessionStorage.getItem("name") || localStorage.getItem("name");
  if (!name) {
    navigate("/");
  }
  const socket = useContext(SocketContext);
  const { roomId } = useParams();
  const [usersInRoom, setUsersInRoom] = useState([]);
  sessionStorage.setItem("room", roomId);

  useBeforeUnload(
    useCallback(() => {
      console.log('before unload is running')
      socket.emit("user_left_room", {
        name,
        roomCode: roomId,
      });
      localStorage.setItem("name", name);
    })
  );
  window.addEventListener('popstate', useBeforeUnload)
  useEffect(() => {
    console.log('useEffect is running')
    // test to see if sockets are working
    socket.emit("USER_JOINED_ROOM", {
      roomId: roomId,
      name: name,
      colorSelected: sessionStorage.getItem("selectedColor"),
    });

    socket.on("JOIN_ROOM_ACCEPTED", (listOfUsers) => {
      console.log("List of users in room from server", listOfUsers);
      setUsersInRoom(listOfUsers);

      socket.on("JOIN_ROOM_DENIED"),
        (result) => {
          console.log("room request denied. No user name.");
          navigate("/");
        };
    });
    
    return () => {
      // Every socket.on needs a corresponding socket.off
      socket.off("JOIN_ROOM_ACCEPTED");
      socket.off("JOIN_ROOM_DENIED");
    };
  }, [socket]);

  
  return (
    <UserContext.Provider value={{ usersInRoom }}>
      <h2>
        {" "}
        <img src={madLibBanner} className="small-banner"></img> Room: {roomId}
      </h2>
      <Row>
        <Col xs="12" sm="12" md="8" lg="8" xl="8">
          <GameBoard />
        </Col>
        <Col>
          <ChatView />
          <UserList userList={usersInRoom} roomCode={roomId} />
        </Col>
      </Row>
    </UserContext.Provider>
  );
};

export default RoomView;
