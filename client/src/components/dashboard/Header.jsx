import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import logo from '../../assets/madlibsHeadOnly.png'
import madLibBanner from '../../assets/madLibBanner.png'
const Header = () => {
  const navigate = useNavigate();
  const logout = () => {
    sessionStorage.clear();
    navigate("/");
  };
  return (
      <Row id="header" className="align-items-center veiwport-height">
        <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto" >
            <img src={madLibBanner} className="small-banner mt-1" />
        </Col>
        <Col>
          <div className="p-3 d-flex justify-content-end">
            <Link to="/madlibs/new">
              <Button variant="outline-secondary" id="import-button">
                Import MadLib
              </Button>
            </Link>
            <Button
              id="logout-button"
              className="ms-4"
              variant="outline-secondary"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </Col>
      </Row>
  );
};

export default Header;