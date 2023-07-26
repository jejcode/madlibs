import React, {useState} from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const UniversalInputForm = (props) => {
  // 
  const {placeHolder, setAction, buttonLabel} = props
  const [localValue, setLocalValue] = useState("")
  const [localValueError, setLocalValueError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if(localValue.length < 1) {
      setLocalValueError('Input must be at least 1 character')
      return
    }
    setLocalValueError('')
    setAction(localValue)
    setLocalValue('')
    console.log(localValue)
  }
  return(
    <Form onSubmit={handleSubmit}>
      <Row className="align-items-end">
        <Col >
          {localValueError && <p className="text-primary">{localValueError}</p>}
          <Form.Control type="text" onChange={(e) => setLocalValue(e.target.value)} value={localValue} placeholder={placeHolder} autoFocus/>
        </Col>
        <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto">
          <Button type="submit" variant="dark">{buttonLabel || 'Submit'}</Button>
        </Col>
      </Row>
    </Form>
  )
}

export default UniversalInputForm