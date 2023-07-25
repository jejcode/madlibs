import mongoose from "mongoose";

const TemplateSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, "Title is required"],
    maxlength: [30, "Limit title to 30 characters"]
  },
  body: {
    type: String,
    required: [true, "Body text is required"],
    minLength: [100, "Body text must be at least 100 characters"],
    maxLength: [2100, "Limit body text to 2100 characters"]
  },
  prompts: {
    type: [{}],
    required: [true, "Text must have words surrounded by {}"]
  },
  solutions: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Solution"
    }]
  }

});

const Template = mongoose.model("Template", TemplateSchema);
export default Template;