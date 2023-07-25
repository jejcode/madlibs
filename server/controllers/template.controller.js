import Template from "../models/template.model.js";

const createTemplate = async (req, res) => {
  try {
    // validate by creating an instance of request
    const newTemplate = new Template(req.body)
    const validationError = newTemplate.validateSync() // synchronous validation

    if(validationError) {
      const errors = {};
      for (const field in validationError.errors) {
        errors[field] = validationError.errors[field].message;
      }
      return res.status(400).json({ errors });
    }
    let madString = req.body.body
    let madArray = madString.split(" ");
    let blankArray = [];
    let tempString = "";
    // iterate through the madArray of strings to find words/phrases surrounded by {}
    for (let i = 0; i < madArray.length; i++) {
      let thisString = madArray[i];
      const pIndex = thisString.indexOf("}");
      const blankIndex = blankArray.length
      // if thisString begins with '{' capture all characters until '}'
      if (thisString[0] === "{") {
        // if thisString begins and ends with curly brackets,
        // remove the curlies and add word to blankArray
        if (pIndex > -1) {
          // create key value pair based off what the index will be in blankArray
          // indexAndPrompt[blankIndex] = thisString.slice(1, pIndex)
          blankArray.push(thisString.slice(1, pIndex));
        } else {
          // if there are multiple words between curlies, use a temp string to hold text
          // until a closed curly shows up in another string
          tempString += thisString.slice(1);
        }
      } else if (tempString) {
        // if tempString has characters in it, add this text to the string until a closed curly is found.
        if (pIndex > -1) {
          // a closed curly is found. Complete the temp string, add temp string to blank array,
          // and reset temp string to false
          tempString += " " + thisString.slice(0, pIndex);
          // indexAndPrompt[blankIndex] = tempString
          blankArray.push(tempString);
          tempString = "";
        } else {
          // no curly found, so keep adding to temp string
          tempString += ` ${thisString}`;
        }
      }
    }
    const postObj = {...req.body, prompts: blankArray}
    const newMadlib = await Template.create(postObj);
    return res.json(newMadlib);
  } catch (err) {
    res.status(400).json(err);
  }
};

const getAllTemplates = async (req, res) => {
  try {
    const allTemplates = await Template.find();
    return res.json(allTemplates);
  } catch (err) {
    console.log(err)
    return res.json(err);
  }
};

const getTemplateById = async (req, res) => {
  try {
    const template = await instance.get(`templates/${req.body}`)
    return template.data
  } catch (error) {
    console.log(error)
    return res.status(400).json(error)
  }
}

const deleteAllTemplates = async (req, res) => {
  try {
    const deletedTemplates = await Template.deleteMany()
    return res.json(deletedTemplates)
  } catch (error) {
    console.log(error)
  }
}

export { createTemplate, getAllTemplates, getTemplateById, deleteAllTemplates };