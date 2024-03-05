import { Router } from "express";
import { SessionController } from "../controllers/SessionControllers";
import { GlobalErrors } from "../middlewares/middleware";
import { sessionCreateSchema } from "../schemas/session.schema";

export const sessionRouter = Router();
const globalErrors = new GlobalErrors();
const sessionController = new SessionController();

sessionRouter.post("/users/login", globalErrors.validateBody(sessionCreateSchema), sessionController.login);
