import { Request, Response } from "express";
import { TaskService } from "../services/TaskServices";

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  public getTasks = async (req: Request, res: Response): Promise<Response> => {
    return this.taskService.getTasks(req, res);
  };

  public getTaskById = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    return this.taskService.getTaskById(req, res);
  };

  public createTask = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    return this.taskService.createTask(req, res);
  };

  public updateTask = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    return this.taskService.updateTask(req, res);
  };

  public deleteTask = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    return this.taskService.deleteTask(req, res);
  };
}
