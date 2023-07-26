import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card"
import Modal from "react-bootstrap/Modal";
import UniversalInputForm from "../components/forms/UniversalInputForm";
import { SocketContext } from "../contexts/socket";
import Header from "../components/dashboard/Header";
import "../App.css"

const DashboardView = () => {
  const socket = useContext(SocketContext);
  const name = sessionStorage.getItem("name");
  const selectedColor = sessionStorage.getItem("selectedColor");

  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClose = (roomId) => {
    console.log(roomId);
    setShow(false);
    socket.emit("REQUEST_TO_JOIN_ROOM", { roomId, name });
  };
  const handleShow = () => setShow(true);

  const resetPage = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const createRoom = () => {
    // Emit the room code to the server to create a new room
    socket.emit("CREATE_ROOM_REQUEST", name, selectedColor);
  };

  const handleRandom = () => {
    // Emit the room code to the server to create a new room
    socket.emit("RANDOM_ROOM_REQUEST", name, selectedColor);
    socket.off("RANDOM_ROOM_REQUEST");
  };

  const closeWithoutJoining = () => {
    setShow(false);
  };

  useEffect(() => {
    // Listen for a response from the server to check if the room was created successfully
    socket.on("CREATE_ROOM_SUCCESS", (roomId) => {
      console.log("navigating to room...", roomId);
      navigate(`/rooms/${roomId}`); // Navigate to the room with the generated code
    });
    // Listen for a response from the server if room exists
    socket.on("ROOM_REQUEST_ACCEPTED", (roomId) => {
      navigate(`/rooms/${roomId}`);
    });
    // Listen for a response from the server if room does not exist
    socket.on("ROOM_REQUEST_DENIED", res => {
      window.alert("Room does not exist.")
    })
    return () => {
      socket.off("CREATE_ROOM_SUCCESS");
      socket.off("ROOM_REQUEST_ACCEPTED")
      socket.off("ROOM_REQUEST_DENIED")

    };
  }, [socket]);

  return (
    <div className="pt-2">
      <Container>
        <Header />
        <Row id="dashboard" className="d-flex justify-content-center align-items-center">
          <Col xs="auto" sm="auto" md="auto" lg="auto">
            <div id="dashboard-card" className="d-flex justify-content-around">
              <Button id="join-room-button" variant="secondary" onClick={handleShow}>Join Room</Button>
              <Button id="create-room-button" variant="secondary" className="ms-4" onClick={createRoom}>Create Room</Button>
            </div>
          </Col>
        </Row>
      </Container>
      <Modal show={show} onHide={closeWithoutJoining} >
                <Modal.Body>
                  <UniversalInputForm
                    setAction={handleClose}
                    placeHolder="Enter room code"
                    buttonLabel="Join"
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleRandom}>
                    Random
                  </Button>
                </Modal.Footer>
              </Modal>
    </div>
  );
};

export default DashboardView;
