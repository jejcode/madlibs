import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function JoinRoom() {
    const [roomCode, setRoomCode] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const { roomCode: joinedRoomCode } = useParams(); // Get the room code from the URL
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        // TODO: Validate room code
        if (roomCode === joinedRoomCode) { // Check if the entered room code matches the one in the URL
            socket.emit("new_user", { roomCode, name: "Your User Name" }); // Emit new_user event with roomCode and user name
            navigate(`/room/${roomCode}`); // Navigate to the room with the provided room code
        } else {
            setModalIsOpen(true);
        }
    };

    return (
        <div>
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

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Invalid Room Code"
            >
                <h2>Invalid Room Code</h2>
                <button onClick={() => setModalIsOpen(false)}>Close</button>
            </Modal>
        </div>
    );
}

export default JoinRoom;
