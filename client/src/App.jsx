import "./App.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import RegisterView from "./views/RegisterView";
import AvatarForm from "./components/forms/AvatarForm";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DashboardView from "./views/DashboardView";
import Container from "react-bootstrap/Container";
import {socket, SocketContext} from './contexts/socket'
import RoomView from "./views/RoomView";

function App() {
  const resetPage = () => {
    
  }
  return (
    <>
      
      <Container>
        <SocketContext.Provider value={socket}>
          <Router>
            <Routes>
                <Route path="/" element={<RegisterView />} />
                <Route path="/dashboard" element={<DashboardView />} />
                <Route path="/rooms/:roomId" element={<RoomView />} />
            </Routes>
          </Router>
        </SocketContext.Provider>
      </Container>
    </>
  );
}

export default App;
