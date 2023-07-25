import React from "react";
import AddMadLibForm from "../components/newMadlib/AddMadlibForm";
import Header from "../components/dashboard/Header";
import Container from 'react-bootstrap/Container'
const AddMadLibView = () => {
  return (
    <Container>
      <Header />
      <h2>New MadLib</h2>
      <AddMadLibForm />
    </Container>
  )
}

export default AddMadLibView