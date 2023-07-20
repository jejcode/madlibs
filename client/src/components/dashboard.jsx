import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleJoinRoom = () => {
        // Navigate to the Join Room page
        navigate('/join-room');
    };

    const handleCreateRoom = () => {
        // Navigate to the Create Room page
        navigate('/create-room');
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleJoinRoom}>Join Room</button>
            <button onClick={handleCreateRoom}>Create Room</button>
        </div>
    );
};

export default Dashboard;
