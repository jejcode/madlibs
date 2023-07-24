import { Router } from "express";
import { createTemplate, getAllTemplates, deleteAllTemplates } from "../controllers/template.controller.js";
const templateRouter = Router()

templateRouter.get('/all', getAllTemplates)
templateRouter.post('/new', createTemplate)
templateRouter.delete('/delete/all', deleteAllTemplates)

export default templateRouter