import React, {useState} from "react";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

const PlayerInputForm = (props) => {
  const {prompts, setSolved, setUserResponses} = props
  const [input, setInput] = useState("")
  const [finished, setFinished] = useState(false)
  if(prompts.length > 0) {
    const [firstPrompt, ...restOfPrompts] = prompts
    const [currentPrompt, setCurrentPrompt] = useState(firstPrompt)
    const [remainingPrompts, setRemainingPrompts] = useState(restOfPrompts)
    setFinished(true)
  }

  const handleSubmit = e => {
    e.preventDefault()
    const returnObj = {}
    returnObj[currentPrompt.index] = input
    setUserResponses(prevUserResponses => {
      return [...prevUserResponses, returnObj]
    })
    setInput('')
    const [newFirst, ...remaining] = remainingPrompts
    if(remainingPrompts.length === 0) {
      setFinished(true)
    } else {
      if(newFirst) {
        setCurrentPrompt(newFirst)
      }
      if(remaining.length > 0) {
        setRemainingPrompts(remaining)
      }
    }

  }
  return (
    <>
      {finished ?
        <div>Waiting for other players...</div>
        :
        <Form onSubmit={handleSubmit}>
          <Form.Label>Enter a {firstPrompt.prompt}</Form.Label>
          <Form.Control type="text" onChange={(e) => setInput(e.target.value)} value={input}/>
          <Button variant="success" type="submit">Next</Button>
        </Form>
    }
    </>
  )
}

export default PlayerInputForm