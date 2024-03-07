import { hash } from "bcryptjs";
import { prisma } from "../database/database";
import { AppError } from "../errors/AppError";
import { CreateUser } from "../interfaces/interfaces";
import { Request, Response } from "express";

export class UserService {
  public async getUsers(req: Request, res: Response): Promise<Response> {
    try {
      let whereClause = {};

      const matchingUsers = await prisma.user.findMany({
        where: whereClause,
        include: { task: true },
      });

      if (matchingUsers.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }

      const response = matchingUsers.map((user) => {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          tasks: user.task,
        };
      });

      return res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const userId = Number(req.params.id);
      const matchingUser = await prisma.user.findUnique({
        where: { id: userId },
        include: { task: true },
      });

      if (!matchingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const response = {
        id: matchingUser.id,
        name: matchingUser.name,
        email: matchingUser.email,
        tasks: matchingUser.task,
      };

      return res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const newUser: CreateUser = req.body;

      newUser.password = await hash(newUser.password, 10);

      if (typeof req.body.name !== "string") {
        return res.status(400).json({ error: "Name must be a string" });
      }

      const createdUser = await prisma.user.create({ data: newUser });

      return res.status(201).json(createdUser);
    } catch (error: any) {
      if (error.code === "P2002" && error.meta?.target?.includes("email")) {
        return res
          .status(409)
          .json({ message: "This email is already registered" });
      } else {
        console.error("Error creating user:", error);
        return res
          .status(500)
          .json({ message: "An error occurred while creating the user" });
      }
    }
  }

  public async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const userId = Number(req.params.id);
      const updatedUserData = req.body;

      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!existingUser) {
        throw new AppError(404, "User not found");
      }

      if (updatedUserData.categoryId) {
        const existingCategory = await prisma.category.findUnique({
          where: { id: updatedUserData.categoryId },
        });
        if (!existingCategory) {
          return res.status(404).json({ message: "Category not found" });
        }
      }

      const updated = await prisma.user.update({
        where: { id: userId },
        data: updatedUserData,
      });

      return res.status(200).json(updated);
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const userId = Number(req.params.id);

      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      await prisma.user.delete({ where: { id: userId } });

      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
