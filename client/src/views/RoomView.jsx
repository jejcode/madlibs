import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChatView from "./ChatView";
import { SocketContext } from "../contexts/socket";
import { UserContext } from "../contexts/users";
const RoomView = () => {
  const name = sessionStorage.getItem("name");
  const socket = useContext(SocketContext);
  const {roomId} = useParams()
  const [usersInRoom, setUsersInRoom] = useState([])

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
    <UserContext.Provider value={{usersInRoom}}>
      {/* <GameboardView /> */}
      <ChatView />
    </UserContext.Provider>
  );
};

export default RoomView;
