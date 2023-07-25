import React from "react";
import AddMadLibForm from "../components/newMadlib/MadLibForm";
import Container from "react-bootstrap/Container";
import Header from "../components/dashboard/Header";

const AddMadLibView = () => {
  return (
    <Container>
      <Header />
      <h2>New MadLib</h2>
      <AddMadLibForm />
    </Container>
  );
};

export default AddMadLibView;
