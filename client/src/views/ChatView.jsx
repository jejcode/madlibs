import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import UniversalInputForm from '../components/forms/UniversalInputForm'
import MessagesWindow from '../components/messages/MessagesWindow'
import { SocketContext } from '../contexts/socket'
import { UserContext } from '../contexts/users'

const ChatView = () => {
  const name = sessionStorage.getItem('name')
  const socket = useContext(SocketContext)
  const context = useContext(UserContext)
  const { usersInRoom } = context
  const { roomId } = useParams()
  const [message, setMessage] = useState('')
  // console.log("users in room",usersInRoom)
  
  useEffect(() => {
    if (message !== '') {
      socket.emit("new_message", {
        name: name,
        message: message,
        roomCode: roomId
      })
    }
  }, [socket, message])

  
  return (
    <div id='ChatView'>
      <h4>Game chat</h4>
      <MessagesWindow />
      <UniversalInputForm placeHolder="Type your message here" setAction={setMessage} buttonLabel="Send" />
    </div>
  )
}

export default ChatView