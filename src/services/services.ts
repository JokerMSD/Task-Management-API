import { Request, Response } from "express";
import { tasksDatabase } from "../database/database";
import { Task } from "../interfaces/interfaces";

export class TaskClass implements Task {
  id: number;
  title: string;
  content: string;
  finished: boolean
  categoryId: number;

  constructor(id: number, title: string, content: string, finished: boolean, categoryId: number) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.finished = finished;
    this.categoryId = categoryId;
  }
}

export class TaskController {
  static idCounter: number = 1;

  static getTasks(req: Request, res: Response): Response {
    let matchingTasks = tasksDatabase;

    if (typeof req.query.search === "string") {   
        const searchedTask: string = req.query.search.toLowerCase();
        
        matchingTasks = tasksDatabase.filter((task) => {
          return task.title.toLowerCase().includes(searchedTask);
        })
    }

    return res.status(200).json(matchingTasks);
  }

  static getTaskById(req: Request, res: Response): Response {
    const id = Number(req.params.id);
    const task = tasksDatabase.find((task) => task.id === id);

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    return res.status(200).json(task);
  }

  static createTask(req: Request, res: Response): Response {
    const newTask = new TaskClass(
      TaskController.idCounter++,
      req.body.title,
      req.body.content,
      req.body.finished,
      req.body.categoryId,
    );

    tasksDatabase.push(newTask);

    return res.status(201).json(newTask);
  }

  static updateTask(req: Request, res: Response): Response {
    const id = Number(req.params.id);
    const task = tasksDatabase.find((task) => task.id === id);

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    if (req.body.content !== undefined) {
      task.content = req.body.content;
    }

    return res.status(200).json(task);
  }

  static deleteTask(req: Request, res: Response): Response {
    const id = Number(req.params.id);
    const taskIndex = tasksDatabase.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({ error: "Task not found." });
    }

    tasksDatabase.splice(taskIndex, 1);

    return res.status(204).send();
  }
}

export default TaskController;
