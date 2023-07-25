import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button';
import logo from '../../assets/madLibsHead.png'
const Header = () => {
  const navigate = useNavigate()
  const logout = () => {
    sessionStorage.clear();
    navigate("/");
  };
  return (
    <Container id="header">
      <Row>
        <Col>
          <img src={logo} width="70px" />
        </Col>
        <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto" className="p-3">
          <Link to="/madlibs/new"><Button variant="outline-secondary" id="import-button">Import MadLib</Button></Link>
          <Button id="logout-button" className="ms-4" variant="outline-secondary" onClick={logout}>Logout</Button>
        </Col>
      </Row>
      <hr />
    </Container>
  )
}

export default Header