import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams, useBeforeUnload } from "react-router-dom";
import ChatView from "./ChatView";
import UserList from "../components/UserList";
import { SocketContext } from "../contexts/socket";
import { UserContext } from "../contexts/users";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const RoomView = () => {
  const name = sessionStorage.getItem("name");
  const socket = useContext(SocketContext);
  const { roomId } = useParams();
  const [usersInRoom, setUsersInRoom] = useState([]);

  useBeforeUnload(
    useCallback(() => {
      socket.emit("new_message", {
        name,
        message: `${name} has left the room`,
        roomCode: roomId,
      });
    })
  );
  useEffect(() => {
    // test to see if sockets are working
    socket.emit("USER_JOINED_ROOM", { roomId, name });

    socket.on("JOIN_ROOM_ACCEPTED", (listOfUsers) => {
      console.log(listOfUsers);
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
        <Col>
          {/* <GameboardView /> */}
          <ChatView />
        </Col>
        <Col>
          <UserList userList={usersInRoom}/>
        </Col>
      </Row>
    </UserContext.Provider>
  );
};

export default RoomView;