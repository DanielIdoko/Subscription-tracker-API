import { Router } from "express";
import { workflowController } from '../controllers/workflow.controller.js';


const workflowRouter = Router();

workflowRouter.get("/", workflowController)

export default workflowRouter