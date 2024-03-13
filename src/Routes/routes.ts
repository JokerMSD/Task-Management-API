import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { TaskController } from "../controllers/TaskController";
import { userCreateSchema } from "../schemas/Index.schemas";
import { SessionController } from "../controllers/SessionControllers";
import { CategoryController } from "../controllers/CategoryControllers";
import { sessionCreateSchema } from "../schemas/session.schema";
import { categoryCreateSchema } from "../schemas/Index.schemas";
import { taskCreateSchema, taskUpdateSchema } from "../schemas/Index.schemas";
import { CheckDuplicateTaskName, GlobalErrors, AuthMiddleware, PermissionMiddleware } from "../middlewares/index.middleware";



const appRouter = Router();
const auth = new AuthMiddleware();
const globalErrors = new GlobalErrors();
const userController = new UserController();
const taskController = new TaskController();
const permission = new PermissionMiddleware()
const sessionController = new SessionController();
const categoryController = new CategoryController();



appRouter.post("/users", globalErrors.validateBody(userCreateSchema), userController.createUser);
appRouter.get("/users/profile", auth.isAuthenticated, userController.getUsers);
appRouter.delete("/users/:id", auth.isAuthenticated, permission.isAdminOrOwnerUser, userController.deleteUser);


appRouter.post("/tasks", auth.isAuthenticated, CheckDuplicateTaskName.getInstance().execute, globalErrors.validateTitle, globalErrors.validateBody(taskCreateSchema), taskController.createTask);
appRouter.get("/tasks", auth.isAuthenticated, taskController.getTasks);
appRouter.get("/tasks/:id", auth.isAuthenticated, taskController.getTaskById);
appRouter.patch( "/tasks/:id", auth.isAuthenticated, permission.isAdminOrOwnerUser, globalErrors.validateBody(taskUpdateSchema), taskController.updateTask);
appRouter.delete("/tasks/:id", auth.isAuthenticated, permission.isAdminOrOwnerUser, taskController.deleteTask);


appRouter.get("/categories", auth.isAuthenticated, categoryController.getCategories);
appRouter.post( "/categories", auth.isAuthenticated, globalErrors.validateBody(categoryCreateSchema), categoryController.createCategory);
appRouter.delete("/categories/:id", auth.isAuthenticated, permission.isAdminOrOwnerUser, categoryController.deleteCategory);


appRouter.post("/users/login", globalErrors.validateBody(sessionCreateSchema), sessionController.login);


export { appRouter };
