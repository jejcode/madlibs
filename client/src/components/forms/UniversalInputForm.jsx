import React, {useState} from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const UniversalInputForm = (props) => {
  // 
  const {placeHolder, setAction, buttonLabel} = props
  const [localValue, setLocalValue] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    setAction(localValue)
    setLocalValue('')
    console.log(localValue)
  }
  return(
    <Form onSubmit={handleSubmit}>
      <Row className="align-items-end">
        <Col >
          <Form.Control type="text" onChange={(e) => setLocalValue(e.target.value)} value={localValue} placeholder={placeHolder} autoFocus/>
        </Col>
        <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto">
          <Button type="submit">{buttonLabel || 'Submit'}</Button>
        </Col>
      </Row>
    </Form>
  )
}

export default UniversalInputForm