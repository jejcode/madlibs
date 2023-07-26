import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddMadLibForm from "../components/newMadlib/MadLibForm";
import MadLibForm from "../components/newMadlib/MadLibForm";
import Container from "react-bootstrap/Container";
import { updateMadLibById, getMadLibById } from "../services/madlib-service";
const EditMadLibView = () => {
  const [madLib, setMadLib] = useState({});
  const [loaded, setLoaded] = useState(false);
  const { madLibId } = useParams();
  useEffect(() => {
    (async () => {
      try {
        const madLibToEdit = await getMadLibById(madLibId);
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
          <MadLibForm edit={true} editTitle={madLib.title} editBody={madLib.body} madLibId={madLib._id}/>
        </Container>
      )}
    </>
  );
};

export default EditMadLibView;
