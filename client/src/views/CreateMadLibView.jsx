import React from "react";
import MadLibForm from "../components/newMadlib/MadLibForm";
import Container from "react-bootstrap/Container";
const CreateMadLibView = () => {
  return (
    <Container>
      <h2>New MadLib</h2>
      <MadLibForm />
    </Container>
  );
};

export default CreateMadLibView;
