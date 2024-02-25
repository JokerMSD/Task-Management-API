import { Request, Response } from "express";
import { CategoryService } from "../services/CategoryServices";

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  public getCategories = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    return this.categoryService.getCategories(req, res);
  };

  public createCategory = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    return this.categoryService.createCategory(req, res);
  };

  public deleteCategory = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    return this.categoryService.deleteCategory(req, res);
  };
}
