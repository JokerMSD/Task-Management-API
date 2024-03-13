import { z } from "zod";

const userSchema = z.object({
  id: z.bigint().positive().transform((id) => id.toLocaleString()),
  name: z.string().min(3).max(255),
  email: z.string().email().max(255),
  password: z.string().max(16),
  isAdmin: z.boolean().default(false),
});

const userCreateSchema = userSchema.omit({ id: true });

const userReturnSchema = userSchema.omit({ password: true });

export { userSchema, userCreateSchema, userReturnSchema };
