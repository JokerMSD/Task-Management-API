import { TaskController } from "../services/services";
import { Router } from "express";
import { CheckTaskExistence, CheckDuplicateTaskName, GlobalErrors } from "../middlewares/middleware";
import { taskSchema, taskCreateSchema, taskUpdateSchema } from "../schemas/task.schemas";

const router = Router();
const globalErrors = new GlobalErrors();
const validateBody = globalErrors.validateBody(taskSchema)

router.use("/tasks", CheckDuplicateTaskName.getInstance().execute);

router.use("/tasks/:id", CheckTaskExistence.getInstance().execute);



router.post("/tasks", validateBody ,globalErrors.validateBody(taskCreateSchema), TaskController.createTask);

router.post("/categories", globalErrors.validateBody(taskCreateSchema), TaskController.createTask);

router.get('/tasks', TaskController.getTasks);

router.get("/tasks/:id", TaskController.getTaskById);

router.patch("/tasks/:id",globalErrors.validateBody(taskUpdateSchema), TaskController.updateTask);

router.delete("/tasks/:id", TaskController.deleteTask);

router.delete("/categories/:id", TaskController.deleteTask);

export default router;
