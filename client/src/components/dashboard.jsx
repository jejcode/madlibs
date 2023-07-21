import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JoinRoom from './joinRoom';
import CreateRoom from './createRoom';

const Dashboard = ({ socket }) => {
    const [joinRoomModalOpen, setJoinRoomModalOpen] = useState(false);
    const [createRoomModalOpen, setCreateRoomModalOpen] = useState(false);
    const [roomCode, setRoomCode] = useState('');
    const { roomCode: joinedRoomCode } = useParams(); // Get the room code from the URL
    const navigate = useNavigate();

    const handleJoinRoom = () => {
        setJoinRoomModalOpen(true);
    };

    const handleCreateRoom = () => {
        setCreateRoomModalOpen(true);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // TODO: Validate room code
        if (roomCode === joinedRoomCode) {
            socket.emit("new_user", { roomCode, name: "Your User Name" });
            navigate(`/room/${roomCode}`);
            setJoinRoomModalOpen(false); // Close the modal after successful form submission
        } else {
            alert('Invalid Room Code');
        }
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleJoinRoom}>Join Room</button>
            <button onClick={handleCreateRoom}>Create Room</button>

            <JoinRoom
                isOpen={joinRoomModalOpen}
                onRequestClose={() => setJoinRoomModalOpen(false)}
                socket={socket}
                closeModal={() => setJoinRoomModalOpen(false)} // Close the modal from JoinRoom component
                handleSubmit={handleSubmit} // Pass the handleSubmit function to JoinRoom component
                roomCode={roomCode} // Pass the roomCode state to JoinRoom component
                setRoomCode={setRoomCode} // Pass the setRoomCode function to JoinRoom component
            />

            <CreateRoom
                socket={socket}
                isOpen={createRoomModalOpen}
                onRequestClose={() => setCreateRoomModalOpen(false)}
                closeModal={() => setCreateRoomModalOpen(false)} // Close the modal from CreateRoom component
            />
        </div>
    );
};

export default Dashboard;
