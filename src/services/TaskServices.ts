import { Request, Response } from "express";
import { Category, Task} from "@prisma/client";
import { prisma } from "../database/database";
import { CreateTask } from "../interfaces/interfaces";

export class TaskClass implements Task {

  id: number;
  title: string;
  content: string;
  finished: boolean;
  categoryId: number;
  category: Category | any;

  constructor(
    id: number,
    title: string,
    content: string,
    finished: boolean,
    categoryId: number,
    category: any[]
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.finished = finished;
    this.categoryId = categoryId;
    this.category = category;
  }
}

export class TaskController {
  public idCounter: number = 1;

public getTasks = async (req: Request, res: Response): Promise<Response> => {
  try {
    const queryParams = req.query.category ? parseInt(String(req.query.category)) : undefined;
    
    const categoryIdFilter = typeof queryParams === 'number' ? { equals: queryParams } : undefined;

    const matchingTasks = await prisma.task.findMany({ 
      where: { categoryId: categoryIdFilter },
      include: { category: true }
    });
    return res.status(200).json(matchingTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

public getTaskById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const taskId = Number(req.params.id);
    const task = await prisma.task.findUnique({ 
      where: { id: taskId },
      include: { category: true }
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

  public createTask = async (req: Request, res: Response): Promise<Response> => {
    try {
      const newTask: CreateTask = req.body;
      const createdTask = await prisma.task.create({ data: newTask });
      return res.status(201).json(createdTask);
    } catch (error) {
      console.error("Error creating task:", error);
      return res.status(404).json({ message: "Category not found" });
    }
  }

  public updateTask = async (req: Request, res: Response): Promise<Response> => {
    try {
      const taskId = Number(req.params.id);
      const updatedTaskData = req.body;
      const updated = await prisma.task.update({ where: { id: taskId }, data: updatedTaskData });

      if (!updated) {
        return res.status(404).json({ error: "Task not found." });
      }

      return res.status(200).json(updated);
    } catch (error) {
      console.error("Error updating task:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public deleteTask = async (req: Request, res: Response): Promise<Response> => {
    try {
      const taskId = Number(req.params.id);
      const deleted = await prisma.task.delete({ where: { id: taskId } });

      if (!deleted) {
        return res.status(404).json({ error: "Task not found." });
      }

      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting task:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}



export default TaskController;
