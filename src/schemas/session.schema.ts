import e from "express";
import { userSchema } from "./user.schema";

const sessionCreateSchema = userSchema.pick({ email: true, password: true });

export { sessionCreateSchema };
