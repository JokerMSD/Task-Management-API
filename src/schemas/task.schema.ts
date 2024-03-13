import { z } from "zod";
import { userSchema } from "./user.schema";
import { categorySchema } from "./category.schema";

const taskSchema = z.object({
  id: z.bigint().positive().transform((id) => id.toLocaleString()),
  title: z.string().min(3),
  content: z.string().min(3),
  finished: z.boolean().optional().default(false),
  categoryId: z.number().optional().nullable(),
  owner: userSchema,
  category: categorySchema,
});

const taskCreateSchema = taskSchema
  .omit({ id: true, owner: true, category: true })
  .extend({ userId: z.number().positive().nullish() });

const taskUpdateSchema = taskCreateSchema.omit({ userId: true }).partial();

const taskArraySchema = taskSchema.array();

export { taskSchema, taskCreateSchema, taskUpdateSchema, taskArraySchema };
