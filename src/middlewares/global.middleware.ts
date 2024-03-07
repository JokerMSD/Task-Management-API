import { AppError } from "../errors/AppError";
import { ServiceInterface } from "../interfaces/interfaces";
import { JsonWebTokenError } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError, ZodIssueCode } from "zod";

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
