import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { createNewMadLib } from "../../services/madlib-service";
const AddMadLibForm = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [titleErrors, setTitleErrors] = useState("");
  const [bodyErrors, setBodyErrors] = useState("");

  const handleTitleChange = (e) => {
    if(e.target.value.length < 2) {
      setTitleErrors('Title must be at least two characters')
    } else {
      setTitleErrors('')
    }
    setTitle(e.target.value)

  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newMadLib = await createNewMadLib({ title, body });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form onSubmit={handleSubmit}>
      {titleErrors && <p>{titleErrors}</p>}
      <Form.Control
        as="input"
        className="mb-2"
        placeholder="Enter title"
        onChange={(e) => {
          handleTitleChange(e);
        }}
        value={title}
      />
      {bodyErrors && <p className="bg-primary">{bodyErrors}</p>}
      <Form.Control
        as="textarea"
        rows="10"
        className="mb-2"
        onChange={(e) => setBody(e.target.value)}
        value={body}
        placeholder="Enter MadLib text here. Use {} around the word you'd like replace. For example: I walked to {noun}."
      />
      <div className="d-flex justify-content-end">
        <Button variant="outline-primary" type="submit">Save</Button>
      </div>
    </Form>
  );
};

export default AddMadLibForm;
