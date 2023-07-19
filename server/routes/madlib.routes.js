import { Router } from "express";
import { createMadlib } from "../controllers/madlib.controller";

const madlibRouter = Router()

madlibRouter.post('/new', createMadlib)

export default madlibRouter