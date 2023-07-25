import { Router } from "express";
import {
  createTemplate,
  getAllTemplates,
  deleteAllTemplates,
  getTemplateById,
  updateTemplateById,
} from "../controllers/template.controller.js";
const templateRouter = Router();

templateRouter.get("/all", getAllTemplates);
templateRouter.post("/new", createTemplate);
templateRouter.put("/:templateId/edit", updateTemplateById);
templateRouter.delete("/delete/all", deleteAllTemplates);

export default templateRouter;
