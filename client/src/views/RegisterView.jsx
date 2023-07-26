import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import madLibBanner from "../assets/madLibBanner.png";
import AvatarForm from "../components/forms/AvatarForm";
import UniversalInputForm from "../components/forms/UniversalInputForm";
const RegisterView = () => {
  const [showNameForm, setShowNameForm] = useState(true);
  const [showAvatarForm, setShowAvatarFrom] = useState(false);

  const registerNewUser = (userName) => {
    sessionStorage.setItem('name', userName)
    localStorage.setItem('name', userName)
    setShowNameForm(false)
    setShowAvatarFrom(true)
  }
  return (
    <Container>
      <h1 className="d-flex justify-content-center">Welcome to</h1>
      <div  className="d-flex justify-content-center">
        <img src={madLibBanner} alt="MadLib Banner"/>
      </div>
      <Row className="justify-content-center">
        <Col xs="11" sm="10" md="8" lg="6" xl="5">
          {showNameForm && (
            <UniversalInputForm
              placeHolder={sessionStorage.name || "Enter a name to begin!"}
              buttonLabel="Enter"
              setAction={registerNewUser}
            />
          )}
          {showAvatarForm && <AvatarForm />}
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterView;
