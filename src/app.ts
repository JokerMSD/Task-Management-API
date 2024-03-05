import "express-async-errors";
import cors from "cors";
import helmet from "helmet";
import { GlobalErrors } from "./middlewares/middleware";
import { appRouter } from "./Routes/routes";
import express, { json } from "express";

export const app = express();
app.use(helmet());
app.use(json());
app.use(cors());
const globalErrors = new GlobalErrors();

app.use( appRouter );

app.use(globalErrors.handleErrors);
