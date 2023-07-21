import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../components/UserContext';
import MessageForm from '../components/MessageForm';
import MessagesDisplay from '../components/MessagesDisplay';
import GameBoard from '../components/gameBoard/GameBoard';


const Room = ({ socket }) => {
    const { roomCode } = useParams(); // Get roomCode from URL
    const [messages, setMessages] = useState([]); //All messages in the room
    const [hasJoined, setHasJoined] = useState(false);
    const { name } = useContext(UserContext); // Get name from UserContext

    console.log("Room Code:", roomCode);
    console.log("User Name:", name);
    console.log("Socket:", socket); 

    useEffect(() => {
        socket.emit('join_room', roomCode); // How users join a room

        socket.on('Welcome', data => console.log(data)); 

        socket.on('new_message', message => {
            console.log("Back from server:", message.message);
            setMessages(oldMessages => [...oldMessages, message]);
        });

        return () => {
            socket.off("Welcome");
            socket.off("new_message");
        };
    }, [socket, roomCode]);

    useEffect(() => {
        console.log("Updated Messages:", messages); // Log messages whenever it changes
    }, [messages]);

    const sendMessage = (message) => {
        socket.emit("new_message", { message, name, roomCode }); // Send message to server
    }

    return (
        <div>
            <GameBoard users={['Jon', 'Mike', 'Joel']}/>
            <h1>Chat Room</h1>
            <MessagesDisplay messages={messages} />
            <MessageForm socket={socket} name={name} onSubmit={sendMessage} />
        </div>
    )
}

export default Room;
