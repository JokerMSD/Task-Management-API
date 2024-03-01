import { AnyZodObject, z } from "zod";
import { Request, Response, NextFunction } from "express";
import { taskUpdateSchema } from "../schemas/task.schema";
import { Task, Category, User } from "@prisma/client";

type CreateTask = Omit<Task, "id" | "category"> & { categoryId: number };

type UpdateTask = z.infer<typeof taskUpdateSchema>;

type CreateCategory = Omit<Category, "id">;

type CreateUser = Omit<User, "id">;

interface RequestSchema {
  params?: AnyZodObject;
  body?: AnyZodObject;
  query?: AnyZodObject;
}

export interface ServiceInterface {
  execute(
    req: Request | undefined,
    res: Response | undefined,
    next: NextFunction | undefined,
  ): Promise<void | Response<any, Record<string, any>>>;
}

export {
  Task,
  CreateTask,
  UpdateTask,
  CreateCategory,
  CreateUser,
  RequestSchema,
};
