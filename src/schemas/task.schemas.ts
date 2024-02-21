import { z } from "zod";

const taskSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(3),
  content: z.string().min(3),
  finished: z.boolean().optional().default(false),
  categoryId: z.number(),
  category: z.object({})
});

const categorySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3),
});

const taskCreateSchema = taskSchema.pick({
  title: true,
  content: true,
  finished: true,
  categoryId: true,
});

const categoryCreateSchema = categorySchema.pick({
  name: true,
});

const taskUpdateSchema = taskCreateSchema.partial();

const taskArraySchema = taskSchema.array();

export { taskSchema, taskCreateSchema, taskUpdateSchema, taskArraySchema, categoryCreateSchema };
