import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams, useBeforeUnload } from "react-router-dom";
import ChatView from "./ChatView";
import GameBoard from "../components/gameboard/gameboard";
import UserList from "../components/room/UserList";
import { SocketContext } from "../contexts/socket";
import { UserContext } from "../contexts/users";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const RoomView = () => {
  const name = sessionStorage.getItem("name");
  const socket = useContext(SocketContext);
  const { roomId } = useParams();
  const [usersInRoom, setUsersInRoom] = useState([]);

  useBeforeUnload(
    useCallback(() => {
      socket.emit("user_left_room", {
        name,
        roomCode: roomId,
      });
    })
  );

  useEffect(() => {
    // test to see if sockets are working
    socket.emit("USER_JOINED_ROOM", { roomId, name });

    socket.on("JOIN_ROOM_ACCEPTED", (listOfUsers) => {
      console.log("List of users in room from server", listOfUsers);
      setUsersInRoom(listOfUsers);
    });
    return () => {
      // Every socket.on needs a corresponding socket.off
      socket.off("JOIN_ROOM_ACCEPTED");
    };
  }, [socket]);
  return (
    <UserContext.Provider value={{ usersInRoom }}>
      <h2>Room: {roomId}</h2>
      <Row>
        <Col xs="12" sm="12" md="8" lg="8" xl="8">
          <GameBoard />
          <ChatView />
        </Col>
        <Col>
          <UserList userList={usersInRoom} roomCode={roomId} />
        </Col>
      </Row>
    </UserContext.Provider>
  );
};

export default RoomView;
