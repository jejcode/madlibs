import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function JoinRoom({ socket, isOpen, onRequestClose, closeModal }) {
    const [roomCode, setRoomCode] = useState('');
    const { roomCode: joinedRoomCode } = useParams(); // Get the room code from the URL
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        // TODO: Validate room code
        if (roomCode === joinedRoomCode) {
            socket.emit("new_user", { roomCode, name: "Your User Name" });
            navigate(`/room/${roomCode}`);
        } else {
            alert('Invalid Room Code');
        }
        closeModal(); // Close the modal after form submission
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Join Room Modal"
        >
            <h2>Join Room</h2>
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
                <button onClick={onRequestClose}>Cancel</button>
            </form>
        </Modal>
    );
}

export default JoinRoom;
