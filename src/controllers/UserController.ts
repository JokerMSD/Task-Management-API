import { Request, Response } from "express";
import { UserService } from "../services/UserServices";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public getUsers = async (req: Request, res: Response): Promise<Response> => {
    return this.userService.getUsers(req, res);
  };

  public getUserById = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    return this.userService.getUserById(req, res);
  };

  public createUser = async ( req: Request, res: Response): Promise<Response> => {
    return this.userService.createUser(req, res);
  };

  public updateUser = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    return this.userService.updateUser(req, res);
  };

  public deleteUser = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    return this.userService.deleteUser(req, res);
  };
}
