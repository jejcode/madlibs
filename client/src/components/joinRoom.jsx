import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function JoinRoom({ socket, isOpen, onRequestClose, closeModal }) {
    const [inputRoomCode, setInputRoomCode] = useState(''); // Rename the state variable
    const { roomCode: joinedRoomCode } = useParams(); // Get the room code from the URL
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        // TODO: Validate room code

        // Emit the room code to the server to check if the room exists
        socket.emit("join_room", inputRoomCode); // Use inputRoomCode instead of roomCode

        // Listen for a response from the server to check if the room exists
        socket.on("room_exists", (exists) => {
            if (exists) {
                // Room exists, join the room and navigate to it
                socket.emit("new_user", { roomCode: inputRoomCode, name: "Your User Name" }); // Use inputRoomCode
                console.log('room exists');
                navigate(`/room/${inputRoomCode}`); // Use inputRoomCode
            } else {
                alert('Invalid Room Code');
            }
        });

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
                        value={inputRoomCode} // Use inputRoomCode instead of roomCode
                        onChange={(event) => setInputRoomCode(event.target.value)} // Use setInputRoomCode
                    />
                </label>
                <button type="submit">Join room</button>
                <button onClick={onRequestClose}>Cancel</button>
            </form>
        </Modal>
    );
}

export default JoinRoom;
