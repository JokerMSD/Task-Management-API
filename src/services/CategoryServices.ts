import { Request, Response } from "express";
import { prisma } from "../database/database";
import { CreateCategory } from "../interfaces/interfaces";

class AppError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class CategoryService {
  public async getCategories( req: Request, res: Response ): Promise<Response> {
    try {

      const categories = await prisma.category.findMany({ include: { owner: true } });

      const response = categories.map((user) => {
        return {
          id: user.id,
          name: user.name,
          owner: user.owner,
        };
      });

      return res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new AppError(500, "Internal server error" );
    }
  }

  public async createCategory(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const newCategory: CreateCategory = req.body;
      const createdCategory = await prisma.category.create({
        data: newCategory,
      });
      return res.status(201).json(createdCategory);
    } catch (error) {
      console.error("Error creating category:", error);
      throw new AppError(500, "Internal server error" );
    }
  }

  public async deleteCategory(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const categoryId = Number(req.params.id);
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new AppError(404, "Category not found.");
      }

      await prisma.category.delete({
        where: { id: categoryId },
      });

      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting category:", error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      throw new AppError(500, "Internal server error" );
    }
  }
}
