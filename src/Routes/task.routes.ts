import { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { taskCreateSchema, taskUpdateSchema } from "../schemas/Index.schemas";
import { CheckDuplicateTaskName, GlobalErrors } from "../middlewares/middleware";

export const taskRouter = Router();
const globalErrors = new GlobalErrors();
const taskController = new TaskController();

taskRouter.post("/tasks", CheckDuplicateTaskName.getInstance().execute, globalErrors.validateTitle, globalErrors.validateBody(taskCreateSchema), taskController.createTask);
taskRouter.get("/tasks", taskController.getTasks);
taskRouter.get("/tasks/:id", taskController.getTaskById);
taskRouter.patch( "/tasks/:id", globalErrors.validateBody(taskUpdateSchema), taskController.updateTask);
taskRouter.delete("/tasks/:id", taskController.deleteTask);
