import Template from "../models/template.model.js";
import { pullPromptsFromText } from "../utils/server-functions.js";
const createTemplate = async (req, res) => {
  try {
    // validate by creating an instance of request
    const newTemplate = new Template(req.body); // create a new instance of the model
    const validationError = newTemplate.validateSync(); // validate the new instance

    if (validationError) { // if there is a validation error, return a 400 response with the errors
      const errors = {};
      for (const field in validationError.errors) {
        errors[field] = validationError.errors[field].message;
      }
      return res.status(400).json({ errors });
    }
    const prompts = pullPromptsFromText(req.body.body); // pull prompts from the body of the template

    const postObj = { ...req.body, prompts }; // create an object to post to the database
    const newMadlib = await Template.create(postObj); // post the object to the database
    return res.json(newMadlib); // return the new object
  } catch (err) {
    res.status(400).json(err);
  }
};

// Get all templates from the database
const getAllTemplates = async (req, res) => {
  try {
    const allTemplates = await Template.find();
    return res.json(allTemplates);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

// Get a template by id
const getTemplateById = async (req, res) => {
  try {
    const template = await Template.findOne({ _id: req.params.templateId });
    return res.json(template);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

// Update a template by id
const updateTemplateById = async (req, res) => {
  try {
    console.log(req.body);
    const objectToUpdate = req.body; // get the object to update from the request body
    const updatedPrompts = pullPromptsFromText(objectToUpdate.body); // pull prompts from the body of the template
    objectToUpdate.prompts = updatedPrompts; // add the prompts to the object to update
    console.log("updating with object", objectToUpdate);
    const template = await Template.findOneAndUpdate( // update the template
      { _id: req.params.templateId },
      objectToUpdate,
      { new: true, runValidators: true }
    );
    return res.json(template);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

// Delete a template by id
const deleteTemplateById = async (req, res) => {
  try {
    const madLibId = req.params.templateId;
    const deletedMadLib = await Template.findByIdAndDelete({ _id: madLibId });
    return res.json(deletedMadLib)
  } catch (error) {
    console.log(error);
  }
};


const deleteAllTemplates = async (req, res) => {
  try {
    const deletedTemplates = await Template.deleteMany();
    return res.json(deletedTemplates);
  } catch (error) {
    console.log(error);
  }
};

export {
  createTemplate,
  getAllTemplates,
  getTemplateById,
  deleteTemplateById,
  deleteAllTemplates,
  updateTemplateById,
};
