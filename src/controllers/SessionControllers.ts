import { Request, Response } from "express";
import { SessionService } from "../services/SessionServices";

export class SessionController {
  private sessionService = new SessionService();

  public login = async (req: Request, res: Response) => {
    const accessToken = await this.sessionService.login(req.body);
    return res.status(200).json(accessToken);
  };
}
