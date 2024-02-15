import { Request, Response, NextFunction } from "express";
import { tasksDatabase } from "../database/database";
import { ServiceInterface } from "../interfaces/interfaces";
import { AppError } from "../errors/AppError";
import { z, AnyZodObject, ZodError, ZodIssueCode  } from "zod";

export class Service implements ServiceInterface {
  execute(
    req: Request | undefined,
    res: Response | undefined,
    next: NextFunction | undefined,
  ): void | Response<any, Record<string, any>> {
    throw new Error("Method not implemented.");
  }
}

export class GlobalErrors {
  handleErrors = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ): Response => {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }

    if (err instanceof ZodError) {
      return res.status(409).json(err);
    }

    return res.status(500).json({ error: "Internal server error" });
  };

  validateBody = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const parsedBody = schema.parse(req.body);

        const extraKeys = Object.keys(req.body).filter(key => !Object.prototype.hasOwnProperty.call(parsedBody, key));
        if (extraKeys.length > 0) {
          const issue = new ZodError([
            {
              code: ZodIssueCode.custom,
              path: extraKeys.map(String),
              message: 'Unexpected value in request body'
            }
          ]);
          throw issue;
        }

        req.body = parsedBody;
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({ error: "Invalid request body", details: error });
        }
        next(error);
      }
    };
  };
}

export class CheckDuplicateTaskName extends Service {
  execute(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void | Response<any, Record<string, any>> {
    const taskName = req.body.name;
    const existingTask = tasksDatabase.find((task) => task.title === taskName);

    if (existingTask) {
      throw new AppError(409, "Task already registered.");
    }

    return next();
  }

  static getInstance(): CheckDuplicateTaskName {
    return new CheckDuplicateTaskName();
  }
}

export class CheckTaskExistence extends Service {
  execute(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void | Response<any, Record<string, any>> {
    const id = Number(req.params.id);
    const taskExists = tasksDatabase.some((task) => task.id === id);

    if (!taskExists) {
      throw new AppError(404, "Task not found.");
    }

    return next();
  }

  static getInstance(): CheckTaskExistence {
    return new CheckTaskExistence();
  }
}
