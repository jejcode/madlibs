import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { SocketContext } from '../contexts/socket';
import UserItem from './UserItem';

const UserList = (props) => {
  const { userList } = props;
  const { roomCode } = props;
  const name = sessionStorage.getItem('name');
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  console.log("userList", userList);

  const leaveRoom = () => {
    socket.emit("user_left_room", { name, roomCode });
    navigate(`/dashboard`);
  };

  return (
    <Row>
      <Col>
        <ul style={{ listStyleType: 'none' }}>
          {userList.map((user, index) => (
            <UserItem key={index} name={user} />
          ))}
        </ul>
        <Button variant="outline-danger" onClick={leaveRoom}>Leave Room</Button>
      </Col>
    </Row>
  );
};

export default UserList;
