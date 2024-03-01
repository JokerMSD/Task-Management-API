import { z } from "zod";
import { categorySchema } from "./category.schema";
import { taskSchema } from "./task.schema";


const userSchema = z.object({
    id: z.bigint().positive().transform((id) => id.toLocaleString()),
    name: z.string().min(3).max(255),
    email: z.string().email().max(255),
    password: z.string().max(16),
    task: taskSchema.nullish(),
    category: categorySchema.nullish(),
});
  
  const userCreateSchema = userSchema.pick({
    name: true,
    email: true,
    password: true,
    task: true,
    category: true
});

export {
    userSchema,
    userCreateSchema,
};
  