import { verify } from "jsonwebtoken";
import { prisma } from "../database/database";
import { AppError } from "../errors/AppError";
import { Request, Response, NextFunction } from "express";

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

    const secret = process.env.SECRET_KEY!;

    const decodedToken: any = verify(token, secret);

    res.locals.userId = decodedToken.id;

    res.locals.actualToken = token;

    return next();
  };
}

export class PermissionMiddleware {
  public isAdminOrOwnerUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const userTokenId = Number(res.locals.decoded.id);
    const userId = Number(res.locals.userId);
    const isAdmin = Boolean(res.locals.decoded.sub);

    console.log(isAdmin);

    const userToken = await prisma.user.findFirst({
      where: { id: userTokenId },
    });

    if (!userToken) {
      throw new AppError(403, "Token owner not found.");
    }

    if (userId === userTokenId || userToken.isAdmin) {
      return next();
    }

    throw new AppError(401, "Insufficient Permissions.");
  };
}
