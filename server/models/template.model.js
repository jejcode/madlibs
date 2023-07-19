import mongoose from "mongoose";

const TemplateSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, "Title is required"] 
  },
  body: {
    type: String,
    required: [true, "Body text is required"],
    maxlength: []
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
