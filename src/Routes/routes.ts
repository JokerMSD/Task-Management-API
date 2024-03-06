import { Router } from "express";
import { CategoryController } from "../controllers/CategoryControllers";
import { categoryCreateSchema } from "../schemas/Index.schemas";
import { SessionController } from "../controllers/SessionControllers";
import { sessionCreateSchema } from "../schemas/session.schema";
import { TaskController } from "../controllers/TaskController";
import { taskCreateSchema, taskUpdateSchema } from "../schemas/Index.schemas";
import { CheckDuplicateTaskName, GlobalErrors, AuthMiddleware } from "../middlewares/middleware";
import { UserController } from "../controllers/UserController";
import { userCreateSchema } from "../schemas/Index.schemas";



const appRouter = Router();
const globalErrors = new GlobalErrors();
const categoryController = new CategoryController();
const userController = new UserController();
const taskController = new TaskController();
const sessionController = new SessionController();
const auth = new AuthMiddleware();



appRouter.post("/users", globalErrors.validateBody(userCreateSchema), userController.createUser);
appRouter.get("/users/profile", auth.isAuthenticated, userController.getUsers);
appRouter.delete("/users/:id", userController.deleteUser);


appRouter.post("/tasks", CheckDuplicateTaskName.getInstance().execute, globalErrors.validateTitle, globalErrors.validateBody(taskCreateSchema), taskController.createTask);
appRouter.get("/tasks", taskController.getTasks);
appRouter.get("/tasks/:id", taskController.getTaskById);
appRouter.patch( "/tasks/:id", globalErrors.validateBody(taskUpdateSchema), taskController.updateTask);
appRouter.delete("/tasks/:id", taskController.deleteTask);


appRouter.get("/categories", categoryController.getCategories);
appRouter.post( "/categories", globalErrors.validateBody(categoryCreateSchema), categoryController.createCategory);
appRouter.delete("/categories/:id", categoryController.deleteCategory);


appRouter.post("/users/login", globalErrors.validateBody(sessionCreateSchema), sessionController.login);


export { appRouter };
