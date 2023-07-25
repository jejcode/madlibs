import React from "react";
import AddMadLibForm from "../components/newMadlib/MadLibForm";
import Container from "react-bootstrap/Container";
const AddMadLibView = () => {
  return (
    <Container>
      <h2>New MadLib</h2>
      <AddMadLibForm />
    </Container>
  );
};

export default AddMadLibView;
