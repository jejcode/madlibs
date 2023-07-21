import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const CreateRoom = ({ isOpen, onRequestClose, socket }) => {
    const [roomCode, setRoomCode] = useState('');
    const navigate = useNavigate();

    const handleGenerateCode = () => {
        // Generate a new 6 character room code
        const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        setRoomCode(newRoomCode);
    };

    useEffect(() => {
        handleGenerateCode();
    }, []);

    const handleCreateRoom = () => {
        // Emit the room code to the server to create a new room
        socket.emit("create_room", roomCode);

        // Listen for a response from the server to check if the room was created successfully
        socket.on("room_created", (createdRoomCode) => {
            navigate(`/room/${createdRoomCode}`); // Navigate to the room with the generated code
        });

        // Listen for an error response from the server if the room code already exists
        socket.on("room_creation_error", (error) => {
            console.log("Room creation error:", error);
            // Handle the error, show a message, etc.
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="New Room Code"
        >
            <h2>New Room Code</h2>
            <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
            />
            <button onClick={handleCreateRoom}>Create Room</button>
            <button onClick={onRequestClose}>Close</button>
        </Modal>
    );
}

export default CreateRoom;
