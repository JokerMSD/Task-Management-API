import { z } from "zod";

const taskSchema = z.object({
  id: z.bigint().positive().transform((id) => id.toLocaleString()),
  title: z.string().min(3),
  content: z.string().min(3),
  finished: z.boolean().optional().default(false),
  categoryId: z.number(),
  ownerId: z.number().optional(),
  category: z.object({}),
});

const taskCreateSchema = taskSchema.pick({
  title: true,
  content: true,
  finished: true,
  categoryId: true,
  ownerId: true,
});

const taskUpdateSchema = taskCreateSchema.partial();

const taskArraySchema = taskSchema.array();

export {
  taskSchema,
  taskCreateSchema,
  taskUpdateSchema,
  taskArraySchema,
};
