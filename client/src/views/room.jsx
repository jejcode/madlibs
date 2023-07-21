import React, { useState, useEffect, } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { UserContext } from '../components/UserContext';
import MessageForm from '../components/messageForm';
import GameBoard from '../components/gameBoard/GameBoard';

const Room = ({ socket }) => {
    const { roomCode } = useParams();
    const [name, setName] = useState(""); //user name
    const [messages, setMessages] = useState([]);

// Room component
useEffect(() => {
    socket.emit('join room', roomCode); // emit 'join room' event to server when component mounts

    socket.on('Welcome', data => console.log(data));
    socket.on('new_message', message => {
        setMessages(oldMessages => [...oldMessages, message]);
    });
    console.log('Latest Messages', messages);
    return () => {
        socket.off("Welcome");
        socket.off("new_message");
    };
}, [socket, messages, roomCode]); // add 'roomCode' to the dependency array

    const sendMessage = (e, message) => {
        e.preventDefault();
        socket.emit("new_message", { message, name }); // emit new_message event to server
    }

    return (
        <div>
            <GameBoard users={['Jon', 'Mike', 'Joel']}/>
            <h1>Chat Room</h1>
            <MessageForm onSubmit={sendMessage} />
        </div>
    )
}

export default Room;
