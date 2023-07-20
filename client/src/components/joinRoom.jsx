// join-room.jsx
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function JoinRoom() {
    const [roomCode, setRoomCode] = useState('');
    const history = useHistory();

    const handleSubmit = (event) => {
        event.preventDefault();
        // TODO: Validate room code
        history.push(`/room/${roomCode}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Room code:
                <input
                    type="text"
                    value={roomCode}
                    onChange={(event) => setRoomCode(event.target.value)}
                />
            </label>
            <button type="submit">Join room</button>
        </form>
    );
}

export default JoinRoom;
