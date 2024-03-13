import { AnyZodObject, z } from "zod";
import { Request, Response, NextFunction } from "express";
import { taskCreateSchema, taskUpdateSchema } from "../schemas/task.schema";
import { categoryCreateSchema } from "../schemas/category.schema";
import { userCreateSchema } from "../schemas/user.schema";

type CreateTask = z.infer<typeof taskCreateSchema>;
type CreateCategory = z.infer<typeof categoryCreateSchema>;
type CreateUser = z.infer<typeof userCreateSchema>;

type UpdateTask = z.infer<typeof taskUpdateSchema>;

interface RequestSchema {
  params?: AnyZodObject;
  body?: AnyZodObject;
  query?: AnyZodObject;
}

export interface ServiceInterface {
  execute( req: Request | undefined, res: Response | undefined, next: NextFunction | undefined ): Promise<void | Response<any, Record<string, any>>>;
}

export {
  CreateTask,
  UpdateTask,
  CreateCategory,
  CreateUser,
  RequestSchema,
};
