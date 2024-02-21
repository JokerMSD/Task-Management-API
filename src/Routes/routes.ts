import { TaskController } from "../services/TaskServices";
import { CategoryController } from "../services/CategoryServices";
import { Router } from "express";
import { CheckTaskExistence, CheckDuplicateTaskName, GlobalErrors } from "../middlewares/middleware";
import { taskCreateSchema, taskUpdateSchema, categoryCreateSchema } from "../schemas/task.schemas";

const router = Router();
const globalErrors = new GlobalErrors();
const taskController = new TaskController();
const categoryController = new CategoryController();



router.post("/tasks", CheckDuplicateTaskName.getInstance().execute, globalErrors.validateBody(taskCreateSchema), taskController.createTask);
router.get('/tasks', taskController.getTasks);
router.get("/tasks/:id", taskController.getTaskById);
router.patch("/tasks/:id",globalErrors.validateBody(taskUpdateSchema), taskController.updateTask);
router.delete("/tasks/:id", taskController.deleteTask);

router.post("/categories", globalErrors.validateBody(categoryCreateSchema), categoryController.createCategory);
router.delete("/categories/:id", categoryController.deleteCategory);

export default router;
