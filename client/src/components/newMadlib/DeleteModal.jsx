import React, {useState} from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
import { deleteMadLibById } from '../../services/madlib-service'

const DeleteModal = (props) => { // This is a modal that pops up when the user clicks the delete button on a madlib
  const {madLibId} = props
  const [show, setShow] = useState(false)
  const navigate = useNavigate()

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleDelete = async () => {
    try {
      console.log(madLibId)
      const confirmDelete = await deleteMadLibById(madLibId)
      navigate(`/rooms/${sessionStorage.getItem("room")}`);
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <Button variant="warning" onClick={handleShow}>Delete</Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>Delete MadLib</Modal.Header>
        <Modal.Body>Are you sure you want to delete this MadLib?</Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={handleClose}>No</Button>
          <Button variant="danger" onClick={handleDelete}>Yes</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default DeleteModal