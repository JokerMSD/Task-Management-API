import { z } from "zod";
import { userSchema } from "./user.schema";

const categorySchema = z.object({
    id: z.bigint().positive().transform((id) => id.toLocaleString()),
    name: z.string().min(3),
    owner: userSchema,
});

const categoryCreateSchema = categorySchema.omit({id:true, owner: true}).extend({ownerId: z.number().positive()});

export { categorySchema, categoryCreateSchema };
  