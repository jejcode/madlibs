import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

function MessageForm({ socket, name }) {
    const [message, setMessage] = useState('');
    const { roomCode } = useParams();

    const handleSubmit = event => {
        event.preventDefault();
        console.log("From",name, message);
        socket.emit('new_message', { name, message, roomCode });
        setMessage('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Message:
                <input type="text" value={message} onChange={e => setMessage(e.target.value)} required />
            </label>
            <button type="submit">Send Message</button>
        </form>
    );
}

export default MessageForm;
