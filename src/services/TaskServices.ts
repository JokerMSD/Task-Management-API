import { prisma } from "../database/database";
import { CreateTask } from "../interfaces/interfaces";
import { Request, Response, request } from "express";

export class TaskService {
  public async createTask(req: Request, res: Response): Promise<Response> {
    try {
      const userId = Number(res.locals.decoded.id);
      const newTask: CreateTask = req.body;

      const url = "http://localhost:3000/categories";
      const token = res.locals.actualToken;
      const data = { name: "Without Category" };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("An error occurred while creating category");
      }

      if (typeof req.body.title !== "string") {
        return res.status(400).json({ error: "Title must be a string" });
      }

      let category = await prisma.category.findFirst({
        where: {
          id:
            newTask.categoryId !== null
              ? { equals: newTask.categoryId }
              : undefined,
        },
      });

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      if (!category) {
        const url = "http://localhost:3000/categories";
        const token = res.locals.actualToken;
        const data = { name: "Without Category" };

        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("An error occurred while creating category");
        }

        const fetchedCategory: any = await response.json();
        category = {
          id: Number(fetchedCategory.id),
          name: fetchedCategory.name,
          userId: fetchedCategory.userId,
        };
      }

      const taskData: any = {
        title: newTask.title,
        content: newTask.content,
        finished: newTask.finished,
        categoryId: category.id,
        userId: userId,
      };

      const createdTask = await prisma.task.create({
        data: taskData,
        include: { owner: true },
      });

      return res.status(201).json(createdTask);
    } catch (error) {
      console.error("Error creating task:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while creating the task" });
    }
  }

  public async getTasks(req: Request, res: Response): Promise<Response> {
    try {
      const categoryNameFilter = req.query.category
        ? String(req.query.category).toLowerCase()
        : undefined;

      let whereClause = {};
      const ownerId = Number(res.locals.decoded.id);
      if (categoryNameFilter) {
        whereClause = {
          userId: ownerId,
          category: {
            name: { equals: categoryNameFilter, mode: "insensitive" },
          },
        };
      } else {
        whereClause = {
          userId: ownerId,
        };
      }

      const matchingTasks = await prisma.task.findMany({
        where: whereClause,
        include: { category: true, owner: true },
      });

      if (matchingTasks.length === 0) {
        return res.status(404).json({ message: "No tasks found" });
      }

      const response = matchingTasks.map((task) => {
        return {
          owner: task.owner,
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
        include: { category: true, owner: true },
      });

      if (!matchingTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      const response = {
        owner: matchingTask.owner,
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

  public async updateTask(req: Request, res: Response): Promise<Response> {
    try {
      const taskId = Number(req.params.id);
      const ownerId = Number(res.locals.decoded.id);
      const isAdmin = String(res.locals.decoded.isAdmin);
      const updatedTaskData = req.body;

      const existingTask = await prisma.task.findUnique({
        where: { id: taskId },
      });
      if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      if (isAdmin != "true") {
        if (existingTask.userId != ownerId) {
          return res
            .status(403)
            .json({ message: "You are not the owner of this task" });
        }
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
      const ownerId = Number(res.locals.decoded.id);
      const isAdmin = String(res.locals.decoded.isAdmin);
      const taskId = Number(req.params.id);

      const existingTask = await prisma.task.findUnique({
        where: { id: taskId },
      });

      if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      if (isAdmin != "true") {
        if (existingTask.userId != ownerId) {
          return res
            .status(403)
            .json({ message: "You are not the owner of this task" });
        }
      }

      await prisma.task.delete({ where: { id: taskId } });

      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting task:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
