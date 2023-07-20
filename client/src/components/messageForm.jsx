import React, { useState } from 'react';

function MessageForm({ socket, name }) {
    const [message, setMessage] = useState('');

    const handleSubmit = event => {
        event.preventDefault();
        console.log("From",name, message);
        socket.emit('new_message', { name, message });
        
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
