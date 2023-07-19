import { Router } from "express";
import { createMadlib } from "../controllers/template.controller.js";
const templateRouter = Router()

templateRouter.post('/new', createMadlib)

export default templateRouter