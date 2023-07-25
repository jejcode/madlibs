import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddMadLibForm from "../components/newMadlib/MadLibForm";
import Container from "react-bootstrap/Container";
import { updateMadLibById } from "../services/madlib-service";
const EditMadLibView = () => {
  const [madLib, setMadLib] = useState({});
  const [loaded, setLoaded] = useState(false);
  const { madLibId } = useParams();
  useEffect(() => {
    (async () => {
      try {
        const madLibToEdit = await updateMadLibById(madLibId);
        setMadLib(madLibToEdit);
        setLoaded(true);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    <>
      {!loaded ? (
        <p>Loading...</p>
      ) : (
        <Container>
          <h2>Edit MadLib</h2>
          <AddMadLibForm edit={true} editTitle={madLib.title} editBody={madLib.body}/>
        </Container>
      )}
    </>
  );
};

export default EditMadLibView;
