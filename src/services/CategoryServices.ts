import { Request, Response } from "express";
import { prisma } from "../database/database";
import { CreateCategory } from "../interfaces/interfaces";

export class CategoryController {
  public createCategory = async ( req: Request, res: Response ): Promise<Response> => {
    try {
      const newTask: CreateCategory = req.body;
      const createdTask = await prisma.category.create({ data: newTask });
      return res.status(201).json(createdTask);
    } catch (error) {
      console.error("Error creating task:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  public deleteCategory = async ( req: Request, res: Response ): Promise<Response> => {
    try {
      const categoryId = Number(req.params.id);
      const deleted = await prisma.category.delete({
        where: { id: categoryId },
      });

      if (!deleted) {
        return res.status(404).json({ error: "Category not found." });
      }

      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting category:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}
