import { useState } from 'react'
import React from 'react';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Main from './views/main';
import Avatar from './views/avatar';

function App() {
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/avatar" element={<Avatar />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

// Testing. Still learning how this works, Joel. -With Love, Michael
