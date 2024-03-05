import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { GlobalErrors } from "../middlewares/middleware";
import { userCreateSchema } from "../schemas/Index.schemas";

export const userRouter = Router();
const globalErrors = new GlobalErrors();
const userController = new UserController();

userRouter.post("/users", globalErrors.validateBody(userCreateSchema), userController.createUser);
userRouter.get("/users/profile", userController.getUsers);
userRouter.delete("/users/:id", userController.deleteUser);