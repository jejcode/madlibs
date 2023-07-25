import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { createNewMadLib } from "../../services/madlib-service";
const AddMadLibForm = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [titleErrors, setTitleErrors] = useState("");
  const [bodyErrors, setBodyErrors] = useState("");

  const navigate = useNavigate()

  const handleTitleChange = (typedTitle) => {
    if(typedTitle.length < 2) {
      setTitleErrors('Title must be at least two characters')
    } else {
      setTitleErrors('')
    }
    setTitle(typedTitle)
  }

  const handleBodyChange = (bodyText) => {
    if(bodyText.length < 100) {
      setBodyErrors('Madlib text must be at least 100 characters')
    } else {
      setBodyErrors('')
    }
    setBody(bodyText)
  }

  const lookForCurlies = (text) => {
    const holdingPen = []
    let tracking = false
    for(let char of text) {
      if(char === '{' && (holdingPen.length === 0 || holdingPen[holdingPen.length - 1] === '}')) {
        holdingPen.push(char)
        tracking = true
      } else if (char === '{' && holdingPen[holdingPen.length - 1] != '}') {
          return false
      }
      if(char === '}' && holdingPen[holdingPen.length - 1] != '{' && tracking) {
        holdingPen.push(char)
        tracking = false
      } else if(char === '}' && !tracking) {
        return false
      }
      if((char != '{' && char != '}') && tracking) {
        holdingPen.push(char)
      }
    }
    if(holdingPen.length === 0) return false
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(body.length < 100) {
      handleBodyChange(body)
      return
    }
    if(!lookForCurlies(body)) {
      setBodyErrors('Text must include balanced pairs of {}. Example: {noun} {verb} not {noun{verb}}')
    } else {
      setBodyErrors('')
    }
    try {
      const newMadLib = await createNewMadLib({ title, body });
      navigate('/dashboard')
    } catch (error) {
      console.log(error);
      setTitleErrors(error.title)
      setBodyErrors(error.body)
    }
  };
  return (
    <Form onSubmit={handleSubmit}>
      {titleErrors && <p className="text-danger">{titleErrors}</p>}
      <Form.Control
        as="input"
        className="mb-2"
        placeholder="Enter title"
        onChange={(e) => {
          handleTitleChange(e.target.value);
        }}
        value={title}
        />
        {bodyErrors && <p className="text-danger">{bodyErrors}</p>}
      <Form.Control
        as="textarea"
        rows="10"
        className="mb-2"
        onChange={(e) => handleBodyChange(e.target.value)}
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
