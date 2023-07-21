import React, { useState } from 'react';
import JoinRoom from './JoinRoom';
import CreateRoom from './CreateRoom';

const Dashboard = ({ socket }) => {
    const [joinRoomModalOpen, setJoinRoomModalOpen] = useState(false);
    const [createRoomModalOpen, setCreateRoomModalOpen] = useState(false);

    const handleJoinRoom = () => {
        setJoinRoomModalOpen(true);
    };

    const handleCreateRoom = () => {
        setCreateRoomModalOpen(true);
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleJoinRoom}>Join Room</button>
            <button onClick={handleCreateRoom}>Create Room</button>

            <JoinRoom 
                isOpen={joinRoomModalOpen} 
                onRequestClose={() => setJoinRoomModalOpen(false)}
            />

            <CreateRoom 
                isOpen={createRoomModalOpen} 
                onRequestClose={() => setCreateRoomModalOpen(false)}
            />
        </div>
    );
};

export default Dashboard;
