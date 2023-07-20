import { useState } from 'react'
import React from 'react';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Main from './views/main';
import Avatar from './views/avatar';
import Dashboard from './views/dashboard';
import Room from './views/room';



function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} default />
          <Route path="/avatar" element={<Avatar />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/room/:roomCode" element={<Room />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

// Testing. Still learning how this works, Joel. -With Love, Michael
