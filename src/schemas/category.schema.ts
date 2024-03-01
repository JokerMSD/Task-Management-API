import { z } from "zod";

const categorySchema = z.object({
    id: z.bigint().positive().transform((id) => id.toLocaleString()),
    name: z.string().min(3),
    ownerId: z.number().optional(),
});

const categoryCreateSchema = categorySchema.pick({
    name: true,
    ownerId: true,
});

export {
    categorySchema,
    categoryCreateSchema,
  };
  