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
  public async getCategories(req: Request, res: Response): Promise<Response> {
    try {
      const categories = await prisma.category.findMany({
        include: { owner: true },
      });

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
      throw new AppError(500, "Internal server error");
    }
  }

  public async createCategory(req: Request, res: Response): Promise<Response> {
    try {
      const ownerId = Number(res.locals.userId);
      const newCategory: CreateCategory = req.body;

      const ownerExists = await prisma.user.findUnique({
        where: { id: ownerId },
      });

      if (!ownerExists) {
        return res.status(400).json({ error: "Owner does not exist." });
      }

      const Category: any = {
        name: newCategory.name,
        userId: ownerId,
      };

      const createdCategory = await prisma.category.create({ data: Category });

      return res.status(201).json(createdCategory);
    } catch (error) {
      console.error("Error creating category:", error);
      throw new AppError(500, "Internal server error");
    }
  }

  public async deleteCategory(req: Request, res: Response): Promise<Response> {
    try {
      const categoryId = Number(req.params.id);
      const ownerId = Number(res.locals.userId);
      const isAdmin = String(res.locals.decoded.sub);

      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new AppError(404, "Category not found.");
      }

      if (isAdmin != "true") {
        if (category.userId != ownerId) {
          return res
            .status(403)
            .json({ message: "You are not the owner of this task" });
        }
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
      throw new AppError(500, "Internal server error");
    }
  }
}
