import React from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import blueAvatar from "../../assets/blue_icon.png";
import redAvatar from "../../assets/red_icon.png";
import yellowAvatar from "../../assets/yellow_icon.png";
import greenAvatar from "../../assets/green_icon.png";
import purpleAvatar from "../../assets/purple_icon.png";
import greyAvatar from "../../assets/grey_icon.png";

const AvatarForm = (props) => {
  const navigate = useNavigate();
  const avatarList = [
    blueAvatar,
    redAvatar,
    yellowAvatar,
    greenAvatar,
    purpleAvatar,
    greyAvatar,
  ];

  const handleAvatarClick = (index) => {
    sessionStorage.setItem('selectedColor', avatarList[index].slice(12))
    navigate("/dashboard");
  };
  return (
    <Container>
      <h3 className="d-flex justify-content-center">Choose an avatar:</h3>
      <Row className="justify-content-center">
        <Col>
          {avatarList.map((avatar, index) => {
            return (
              <img
                key={index}
                className="m-2"
                src={avatar}
                onClick={() => handleAvatarClick(index)}
              />
            );
          })}
        </Col>
      </Row>
    </Container>
  );
};

export default AvatarForm;
