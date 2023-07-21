import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './views/Main';
import Avatar from './views/Avatar';
import DashboardPage from './views/DashboardPage';
import Room from './views/Room';
import UserProvider from './components/UserContext';
import io from 'socket.io-client';

const socket = io('http://localhost:8000');

const App = () => {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/avatar" element={<Avatar />} />
          <Route path="/dashboard" element={<DashboardPage socket={socket}/>} />
          <Route path="/room/:roomCode" element={<Room socket={socket} />} /> {/* Pass the socket instance to the Room component */}
        </Routes>
      </UserProvider>
    </Router>
  );
};

export default App;
