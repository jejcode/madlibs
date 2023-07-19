import Template from "../models/template.model.js";

const createTemplate = async (req, res) => {
  try {
    const newMadlib = await Template.create(req.body);
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
    return res.json(err);
  }
};

export { createTemplate, getAllTemplates };
