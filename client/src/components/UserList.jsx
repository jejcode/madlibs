import React, {useContext, useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { SocketContext } from '../contexts/socket';

const UserList = (props) => {
  const {userList} = props
  const {roomCode} = useParams()
  const name = sessionStorage.getItem('name')
  const avatar = sessionStorage.getItem('selectedColor')
  const socket = useContext(SocketContext)
  const navigate = useNavigate()


  const leaveRoom = () => {
    socket.emit("user_left_room", {name, roomCode})
    navigate(`/dashboard`)
  }
  return (
    <Row>
      <Col>
      <ul>
      {userList.map((user, index) => {
        <li key={index}>
            <img src = {`../../assets/${avatar}`} className='user-icon'></img>
            <span>{name}</span>
        </li>
      })}
      </ul>
        <Button variant="outline-danger" onClick={leaveRoom}>Leave Room</Button>
      </Col>
    </Row>

  )
}

export default UserList