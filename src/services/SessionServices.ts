import { compare } from "bcryptjs";
import { prisma } from "../database/database";
import { AppError } from "../errors/AppError";
import { SessionCreate, SessionReturn } from "../interfaces/session.interface";
import { sign } from "jsonwebtoken";

export class SessionService {
  public login = async ({
    email,
    password,
  }: SessionCreate): Promise<SessionReturn> => {
    const foundUser = await prisma.user.findFirst({ where: { email } });
    if (!foundUser) {
      throw new AppError(404, "User not exists");
    }

    const pwdMatch = await compare(password, foundUser.password);
    if (!pwdMatch) {
      throw new AppError(401, "Email and password doesn't match");
    }

    const secret = process.env.SECRET_KEY!;
    const expiresIn = process.env.EXPIRES_IN!;

    const accessToken = sign({ id: foundUser.id }, secret, {
      expiresIn,
      subject: String(foundUser.isAdmin),
    });

    return {
      accessToken,
      user: {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
      },
    };
  };
}
