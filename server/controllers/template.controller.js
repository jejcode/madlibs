import Template from "../models/template.model.js";
import { pullPromptsFromText } from "../utils/server-functions.js";
const createTemplate = async (req, res) => {
  try {
    // validate by creating an instance of request
    const newTemplate = new Template(req.body);
    const validationError = newTemplate.validateSync(); // synchronous validation

    if (validationError) {
      const errors = {};
      for (const field in validationError.errors) {
        errors[field] = validationError.errors[field].message;
      }
      return res.status(400).json({ errors });
    }
    const prompts = pullPromptsFromText(req.body.body)
    
    const postObj = { ...req.body, prompts };
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
    console.log(err);
    return res.json(err);
  }
};

const getTemplateById = async (req, res) => {
  try {
    const template = await Template.findOne({ _id: req.params.templateId });
    return res.json(template);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

const updateTemplateById = async (req, res) => {
  try {
    console.log()
    const objectToUpdate = req.body
    const updatedPrompts = pullPromptsFromText(objectToUpdate.body)
    objectToUpdate.prompts = updatedPrompts
    console.log('updating with object', objectToUpdate)
    const template = await Template.findOneAndUpdate(
      { _id: req.params.templateId },
      objectToUpdate,
      { new: true,
      runValidators: true }
    );
    return res.json(template);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

const updateMenu = async (req, res) => {
  try {
    const updatedMenu = await Menu.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true },
      { runValidators: true }
    );
    return res.json(updatedMenu);
  } catch (err) {
    res.status(400).json(err);
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

export { createTemplate, getAllTemplates, getTemplateById, deleteAllTemplates, updateTemplateById };
