import Madlib from "../models/madlib.model";

const createMadlib = async (req, res) => {
  try {
    const newMadlib = await Madlib.create(req.body);
    return res.json(newMadlib);
  } catch (err) {
    res.status(400).json(err);
  }
};



export {
  createMadlib
};
