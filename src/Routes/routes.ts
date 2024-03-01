import { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { CategoryController } from "../controllers/CategoryControllers";
import { UserController } from "../controllers/UserController";
import {
  CheckDuplicateTaskName,
  GlobalErrors,
} from "../middlewares/middleware";
import {
  taskCreateSchema,
  taskUpdateSchema,
  categoryCreateSchema,
  userCreateSchema,
} from "../schemas/Index.schemas";

const router = Router();
const globalErrors = new GlobalErrors();
const taskController = new TaskController();
const categoryController = new CategoryController();
const userController = new UserController();

router.post(
  "/users",
  globalErrors.validateBody(userCreateSchema),
  userController.createUser,
);
router.get("/users/profile", userController.getUsers);
router.get("/users/:id", userController.getUserById);
router.patch("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

router.post(
  "/tasks",
  CheckDuplicateTaskName.getInstance().execute,
  globalErrors.validateTitle,
  globalErrors.validateBody(taskCreateSchema),
  taskController.createTask,
);
router.get("/tasks", taskController.getTasks);
router.get("/tasks/:id", taskController.getTaskById);
router.patch(
  "/tasks/:id",
  globalErrors.validateBody(taskUpdateSchema),
  taskController.updateTask,
);
router.delete("/tasks/:id", taskController.deleteTask);

router.get("/categories", categoryController.getCategories);
router.post(
  "/categories",
  globalErrors.validateBody(categoryCreateSchema),
  categoryController.createCategory,
);
router.delete("/categories/:id", categoryController.deleteCategory);

export default router;
