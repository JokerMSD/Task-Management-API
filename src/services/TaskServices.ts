import { Request, Response } from "express";
import { prisma } from "../database/database";
import { CreateTask } from "../interfaces/interfaces";
import { AppError } from "../errors/AppError";

export class TaskService {
  public async getTasks(req: Request, res: Response): Promise<Response> {
    try {
      const categoryNameFilter = req.query.category
        ? String(req.query.category).toLowerCase()
        : undefined;

      let whereClause = {};
      if (categoryNameFilter) {
        whereClause = {
          category: {
            name: { equals: categoryNameFilter, mode: "insensitive" },
          },
        };
      }

      const matchingTasks = await prisma.task.findMany({
        where: whereClause,
        include: { category: true },
      });

      if (matchingTasks.length === 0) {
        return res.status(404).json({ message: "No tasks found" });
      }

      const response = matchingTasks.map((task) => {
        return {
          id: task.id,
          title: task.title,
          content: task.content,
          finished: task.finished,
          category: task.category,
        };
      });

      return res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public async getTaskById(req: Request, res: Response): Promise<Response> {
    try {
      const taskId = Number(req.params.id);
      const matchingTask = await prisma.task.findUnique({
        where: { id: taskId },
        include: { category: true },
      });

      if (!matchingTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      const response = {
        id: matchingTask.id,
        title: matchingTask.title,
        content: matchingTask.content,
        finished: matchingTask.finished,
        category: matchingTask.category,
      };

      return res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching task:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public async createTask(req: Request, res: Response): Promise<Response> {
    try {
      const newTask: CreateTask = req.body;

      if (typeof req.body.title !== "string") {
        return res.status(400).json({ error: "Title must be a string" });
      }

      const category = await prisma.category.findUnique({
        where: { id: newTask.categoryId },
      });
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      const createdTask = await prisma.task.create({ data: newTask });

      return res.status(201).json(createdTask);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error creating task:", error);
      } else {
        console.error("An unexpected error occurred:", error);
      }
      return res
        .status(500)
        .json({ message: "An error occurred while creating the task" });
    }
  }

  public async updateTask(req: Request, res: Response): Promise<Response> {
    try {
      const taskId = Number(req.params.id);
      const updatedTaskData = req.body;

      const existingTask = await prisma.task.findUnique({
        where: { id: taskId },
      });
      if (!existingTask) {
        throw new AppError(404, "Task not found" );
      }

      if (updatedTaskData.categoryId) {
        const existingCategory = await prisma.category.findUnique({
          where: { id: updatedTaskData.categoryId },
        });
        if (!existingCategory) {
          return res.status(404).json({ message: "Category not found" });
        }
      }

      const updated = await prisma.task.update({
        where: { id: taskId },
        data: updatedTaskData,
      });

      return res.status(200).json(updated);
    } catch (error) {
      console.error("Error updating task:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public async deleteTask(req: Request, res: Response): Promise<Response> {
    try {
      const taskId = Number(req.params.id);

      const existingTask = await prisma.task.findUnique({
        where: { id: taskId },
      });

      if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      await prisma.task.delete({ where: { id: taskId } });

      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting task:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
