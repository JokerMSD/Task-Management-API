import { Request, Response, NextFunction } from "express";
import { prisma } from "../database/database";
import { ServiceInterface } from "../interfaces/interfaces";
import { AppError } from "../errors/AppError";
import { AnyZodObject, ZodError, ZodIssueCode } from "zod";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { JsonWebTokenError, verify } from "jsonwebtoken";

export abstract class Service implements ServiceInterface {
  abstract execute(
    req: Request | undefined,
    res: Response | undefined,
    next: NextFunction | undefined,
  ): Promise<void | Response<any, Record<string, any>>>;
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
      return res.status(400).json(err);
    }

    if (err instanceof JsonWebTokenError) {
      return res.status(401).json({ message: err.message });
    }

    return res.status(500).json({ error: "Internal server error" });
  };

  validateTitle(req: Request, res: Response, next: NextFunction) {
    const { title } = req.body;

    if (typeof title === "number") {
      return res.status(400).json({ error: "Title cannot be a number" });
    }

    next();
  }

  validateBody = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const parsedBody = schema.parse(req.body);

        const extraKeys = Object.keys(req.body).filter(
          (key) => !Object.prototype.hasOwnProperty.call(parsedBody, key),
        );
        if (extraKeys.length > 0) {
          const issue = new ZodError([
            {
              code: ZodIssueCode.custom,
              path: extraKeys.map(String),
              message: "Unexpected value in request body",
            },
          ]);
          throw issue;
        }

        req.body = parsedBody;
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          return res
            .status(400)
            .json({ error: "Invalid request body", details: error });
        }
        next(error);
      }
    };
  };
}

export class CheckDuplicateTaskName extends Service {
  public execute = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<any, Record<string, any>>> => {
    const taskName = req.body.title;

    if (typeof taskName !== "string") {
      return res.status(400).json({ error: "Title must be a string" });
    }

    try {
      const existingTask = await prisma.task.findFirst({
        where: {
          title: taskName,
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

export class AuthMiddleware {
  public isAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new AppError(401, "Unauthorized");
    }

    const [_bearer, token] = authorization.split(" ");

    const secret = process.env.SECRET_KEY!

    res.locals = {
      ...res.locals,
      decoded: verify(token, secret)
    }

    return next();
  };
}
