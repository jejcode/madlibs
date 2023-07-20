import React, { useState, useEffect, } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import MessageForm from '../components/messageForm';

const Room = () => {
    const { roomCode } = useParams();
    const [socket] = useState(() => io(':8000')); // instantiate socket connection
    const [name, setName] = useState(""); //user name
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('Welcome', data => console.log(data)); // listen for Welcome event
        socket.on('new_message', message => { // listen for new_message event
            setMessages(oldMessages => [...oldMessages, message]); // add new message to messages array
        });
        console.log('Latest Messages', messages);
        return () => { // return callback to run when component unmounts
            socket.off("Welcome"); // turn off Welcome event listener
            socket.off("new_message"); // turn off new_message event listener
        };
    }, [socket, messages]); // add 'messages' to the dependency array

    const sendMessage = (e, message) => {
        e.preventDefault();
        socket.emit("new_message", { message, name }); // emit new_message event to server
    }

    return (
        <div>
            <h1>Chat Room</h1>
            <MessageForm onSubmit={sendMessage} />
        </div>
    )
}

export default Room;
