import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { SocketContext } from "../../contexts/socket";
import UserItem from "./UserItem";

const UserList = (props) => {
  const { roomCode } = props;
  const name = sessionStorage.getItem("name");
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]); // Use state to store the userList

  const leaveRoom = () => {
    socket.emit("user_left_room", { name, roomCode });
    navigate(`/dashboard`);
  };

  useEffect(() => {
    // When the component mounts, update the userList with the initial list
    setUserList(props.userList);

    // Listen for the "USER_JOINED_ROOM" event and update the userList
    socket.on("USER_JOINED_ROOM", (users) => {
      setUserList(users);
    });

    // Listen for the "USER_LEFT_ROOM" event and update the userList
    socket.on("USER_LEFT_ROOM", (users) => {
      setUserList(users);
    });

    // Clean up the event listeners when the component unmounts
    return () => {
      socket.off("USER_JOINED_ROOM");
      socket.off("USER_LEFT_ROOM");
    };
  }, [socket, props.userList]);

  return (
    
      <Col id="UserList">
          {userList.map((user, index) => (
            <UserItem key={index} name={user} />
          ))}
        <Button variant="outline-danger" onClick={leaveRoom}>
          Leave Room
        </Button>
      </Col>
    
  );
};

export default UserList;
