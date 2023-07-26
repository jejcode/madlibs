import React, { useState } from "react";
import DeleteModal from "./DeleteModal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import {
  createNewMadLib,
  updateMadLibById,
} from "../../services/madlib-service";

const MadLibForm = (props) => {
  const { edit, editTitle, editBody, madLibId } = props;
  const [title, setTitle] = useState(editTitle || "");
  const [body, setBody] = useState(editBody || "");
  const [titleErrors, setTitleErrors] = useState("");
  const [bodyErrors, setBodyErrors] = useState("");

  const navigate = useNavigate();

  const handleTitleChange = (typedTitle) => {
    if (typedTitle.length < 2) {
      setTitleErrors("Title must be at least two characters");
    } else {
      setTitleErrors("");
    }
    setTitle(typedTitle);
  };

  const handleBodyChange = (bodyText) => {
    if (bodyText.length < 100) {
      setBodyErrors("Madlib text must be at least 100 characters");
    } else {
      setBodyErrors("");
    }
    setBody(bodyText);
  };

  const lookForCurlies = (text) => {
    const holdingPen = [];
    let tracking = false;
    for (let char of text) {
      if (
        char === "{" &&
        (holdingPen.length === 0 || holdingPen[holdingPen.length - 1] === "}")
      ) {
        holdingPen.push(char);
        tracking = true;
      } else if (char === "{" && holdingPen[holdingPen.length - 1] != "}") {
        return false;
      }
      if (
        char === "}" &&
        holdingPen[holdingPen.length - 1] != "{" &&
        tracking
      ) {
        holdingPen.push(char);
        tracking = false;
      } else if (char === "}" && !tracking) {
        return false;
      }
      if (char != "{" && char != "}" && tracking) {
        holdingPen.push(char);
      }
    }
    if (holdingPen.length === 0) return false;
    return true;
  };

  const handleCancel = () => {
    if (edit) {
      navigate(`/rooms/${sessionStorage.getItem("room")}`);
    } else {
      navigate(`/dashboard`);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (body.length < 100) {
      handleBodyChange(body);
      return;
    }
    if (!lookForCurlies(body)) {
      setBodyErrors(
        "Text must include balanced pairs of {}. Example: {noun} {verb} not {noun{verb}}"
      );
      return;
    } else {
      setBodyErrors("");
    }
    try {
      if (!edit) {
        const newMadLib = await createNewMadLib({ title, body });
        navigate("/dashboard");
      } else {
        const updatedMadLib = await updateMadLibById({ madLibId, title, body });
        navigate(`/rooms/${sessionStorage.getItem("room")}`);
      }
    } catch (error) {
      console.log(error);
      setTitleErrors(error.title);
      setBodyErrors(error.body);
    }
  };
  return (
    <>
      <Form onSubmit={handleSubmit}>
        {titleErrors && <p className="text-white">{titleErrors}</p>}
        <Form.Control
          as="input"
          className="mb-2"
          placeholder="Enter title"
          onChange={(e) => {
            handleTitleChange(e.target.value);
          }}
          value={title}
        />
        {bodyErrors && <p className="text-white">{bodyErrors}</p>}
        <Form.Control
          as="textarea"
          rows="10"
          className="mb-2"
          onChange={(e) => handleBodyChange(e.target.value)}
          value={body}
          placeholder="Enter MadLib text here. Use {} around the word you'd like replace. For example: I walked to {noun}."
        />
        <div className="d-flex justify-content-end">
          <Button variant="outline-light" className="mx-4" onClick={handleCancel}>
            Back
          </Button>
          <Button variant="outline-dark" type="submit">
            Save
          </Button>
        </div>
      </Form>
      {edit && (
        <div className="">
          <DeleteModal madLibId={madLibId}/>
        </div>
      )}
    </>
  );
};

export default MadLibForm;
