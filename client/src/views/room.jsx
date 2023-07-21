import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../components/UserContext'; // Import the UserContext
import MessageForm from '../components/MessageForm';
import MessagesDisplay from '../components/MessagesDisplay';
import GameBoard from '../components/gameBoard/GameBoard';


const Room = ({ socket }) => {
    const { roomCode } = useParams();
    const [messages, setMessages] = useState([]);
    const [hasJoined, setHasJoined] = useState(false);
    const { name } = useContext(UserContext); // Access the user's name from the UserContext
    console.log("Room Code:", roomCode); // Check if the roomCode is received correctly
    console.log("User Name:", name); 
    console.log("Socket:", socket); // Check if the socket is received correctly


    useEffect(() => {
        socket.emit('join room', roomCode); // Emit the roomCode to the server
        socket.on('Welcome', data => console.log(data)); // Listen for a welcome event from the server when the user joins the room
        socket.on('new_message', message => { // Listen for a new_message event from the server
            console.log(message); //Not getting anything here
            setMessages(oldMessages => [...oldMessages, message]);
            console.log(messages); //Not getting anything here
        });
        return () => {
            socket.off("Welcome");
            socket.off("new_message");
        };
    }, [socket, roomCode, name]);

    const sendMessage = (message) => {
        socket.emit("new_message", { message, name });
    }

    return (
        <div>
            <GameBoard users={['Jon', 'Mike', 'Joel']}/>
            <h1>Chat Room</h1>

            <MessageForm socket={socket} name={name} onSubmit={sendMessage} />
            <MessagesDisplay messages={messages} />
        </div>
    )
}

export default Room;
