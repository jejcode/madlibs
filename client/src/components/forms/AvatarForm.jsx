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
    { color: "blue", image: blueAvatar },
    { color: "red", image: redAvatar },
    { color: "yellow", image: yellowAvatar },
    { color: "green", image: greenAvatar },
    { color: "purple", image: purpleAvatar },
    { color: "grey", image: greyAvatar },
  ];

  const handleAvatarClick = (color) => {
    sessionStorage.setItem('selectedColor', color);
    console.log(sessionStorage.getItem('selectedColor'));
    navigate("/dashboard");
  };
  return (
    <Container>
      <h3 className="d-flex justify-content-center">Choose an avatar:</h3>
      <Row className="justify-content-center">
        <Col id="avatar-list">
          {avatarList.map((avatar, index) => {
            return (
              <img
                key={index}
                className="m-2"
                src={avatar.image}
                onClick={() => handleAvatarClick(avatar.color)}
              />
            );
          })}
        </Col>
      </Row>
    </Container>
  );
};

export default AvatarForm;
