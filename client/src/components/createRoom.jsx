import React, { useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const CreateRoom = ({ isOpen, onRequestClose }) => {
    const [roomCode, setRoomCode] = useState('');
    const navigate = useNavigate();

    const handleGenerateCode = () => {
        // Generate a new 6 character room code
        const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        setRoomCode(newRoomCode);
    };

    const handleCreateRoom = () => {
        // Navigate to the room with the generated code
        navigate(`/room/${roomCode}`);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="New Room Code"
        >
            <h2>New Room Code</h2>
            <p>{roomCode}</p>
            <button onClick={handleGenerateCode}>Generate Code</button>
            <button onClick={handleCreateRoom}>Create Room</button>
            <button onClick={onRequestClose}>Close</button>
        </Modal>
    );
}

export default CreateRoom;
