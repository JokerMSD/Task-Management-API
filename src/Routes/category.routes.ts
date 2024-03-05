import { Router } from "express";
import { CategoryController } from "../controllers/CategoryControllers";
import { GlobalErrors } from "../middlewares/middleware";
import { categoryCreateSchema } from "../schemas/Index.schemas";

export const categoryRouter = Router();
const globalErrors = new GlobalErrors();
const categoryController = new CategoryController();

categoryRouter.get("/categories", categoryController.getCategories);
categoryRouter.post( "/categories", globalErrors.validateBody(categoryCreateSchema), categoryController.createCategory);
categoryRouter.delete("/categories/:id", categoryController.deleteCategory);