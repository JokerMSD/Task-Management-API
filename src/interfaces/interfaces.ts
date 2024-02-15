import { AnyZodObject, z } from "zod";
import { Request, Response, NextFunction } from "express";
import {
  taskArraySchema,
  taskCreateSchema,
  taskSchema,
  taskUpdateSchema,
} from "../schemas/task.schemas";

type Task = z.infer<typeof taskSchema>;

type CreateTask = z.infer<typeof taskCreateSchema>;

type UpdateTask = z.infer<typeof taskUpdateSchema>;

type TaskArray = z.infer<typeof taskArraySchema>

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
    ): void | Response<any, Record<string, any>>;
  }
  
  export { Task, CreateTask, UpdateTask, TaskArray, RequestSchema };