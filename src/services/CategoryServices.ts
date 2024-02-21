import { Request, Response } from "express";
import { prisma } from "../database/database";
import { CreateCategory } from "../interfaces/interfaces";
import { category } from "../tests/mocks/category.mocks";


export class CategoryController {

  public getCategories = async (req: Request, res: Response): Promise<Response> => {
    try {
      const categories = await prisma.category.findMany();
      return res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
  

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
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found." });
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
 }
}
