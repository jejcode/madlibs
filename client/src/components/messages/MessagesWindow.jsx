import React, { useContext, useState, useEffect, useRef } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { SocketContext } from '../../contexts/socket'

const MessagesWindow = () => {
  const name = sessionStorage.getItem('name')
  const socket = useContext(SocketContext)
  const [allMessages, setAllMessages] = useState([])
  const endRef = useRef()
  useEffect(() => {
    socket.on('new_message', message => {
      // console.log('From Server', message.message);
      setAllMessages(oldMessages => [...oldMessages, message]);
    }
    )

    endRef?.current?.scrollIntoView({ behavior: 'instant' })
    return (() => {
      socket.off('new_message')
    })
  }, [socket, allMessages])

  return (
    <Row className="mb-2 p-2 mh-250">
      <Col id="MessagesWindow">
        <div id="chatWindow" className="p-2">
          {allMessages.map((message, index) => {
            return (
              <React.Fragment key={index}>
                {message.isNewUser ?
                  <p>({message.message})</p>
                  :
                  <p><strong>{message.name}:</strong> {message.message}</p>
                }
              </React.Fragment>
            )
          })}

          <div ref={endRef} ></div>
        </div>
      </Col>
    </Row>
  )
}

export default MessagesWindow

// state allMessages and setAllMessages
// listen for event receiving new messages