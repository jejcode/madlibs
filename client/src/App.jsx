import "./App.css";
import React from "react";
import RoomView from "./views/RoomView";
import "bootstrap/dist/css/bootstrap.min.css";
import RegisterView from "./views/RegisterView";
import AddMadLibView from "./views/AddMadlibView";
import Container from "react-bootstrap/Container";
import DashboardView from "./views/DashboardView";
import EditMadLibView from "./views/EditMadLibView";
import {socket, SocketContext} from './contexts/socket'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
                <Route path="/madlibs/new" element={<AddMadLibView />} />
                <Route path="/madlibs/:madLibId/edit" element={<EditMadLibView />} />
            </Routes>
          </Router>
        </SocketContext.Provider>
      </Container>
    </>
  );
}

export default App;
