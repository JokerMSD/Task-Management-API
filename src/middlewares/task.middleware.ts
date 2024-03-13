import { prisma } from "../database/database";
import { Service } from "./global.middleware";
import { AppError } from "../errors/AppError";
import { ParsedQs } from "qs";
import { ParamsDictionary } from "express-serve-static-core";
import { Request, Response, NextFunction } from "express";

export class CheckDuplicateTaskName extends Service {
  public execute = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<any, Record<string, any>>> => {
    const taskName = req.body.title;
    const ownerId = Number(res.locals.userId);

    if (typeof taskName !== "string") {
      return res.status(400).json({ error: "Title must be a string" });
    }

    try {
      const existingTask = await prisma.task.findFirst({
        where: {
          title: taskName,
          userId: ownerId,
        },
      });

      if (existingTask) {
        throw new AppError(409, "Task already registered.");
      }

      return next();
    } catch (error) {
      next(error);
    }
  };

  static getInstance(): CheckDuplicateTaskName {
    return new CheckDuplicateTaskName();
  }
}

export class CheckTaskExistence extends Service {
  private static instance: CheckTaskExistence;

  private constructor() {
    super();
  }

  public static getInstance(): CheckTaskExistence {
    if (!CheckTaskExistence.instance) {
      CheckTaskExistence.instance = new CheckTaskExistence();
    }

    return CheckTaskExistence.instance;
  }

  execute(
    req:
      | Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>
      | undefined,
    res: Response<any, Record<string, any>> | undefined,
    next: NextFunction | undefined,
  ): Promise<void | Response<any, Record<string, any>>> {
    throw new Error("Method not implemented.");
  }

  async handleRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const task = await prisma.task.findUnique({
        where: {
          id: id,
        },
      });

      if (!task) {
        throw new AppError(404, "Task not found.");
      }

      res.locals.task = task;
      return next();
    } catch (error) {
      next(error);
    }
  }
}
