import { Router } from "express";
import { createTemplate, getAllTemplates } from "../controllers/template.controller.js";
const templateRouter = Router()

templateRouter.get('/all', getAllTemplates)
templateRouter.post('/new', createTemplate)

export default templateRouter