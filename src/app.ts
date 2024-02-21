import "express-async-errors";
import express, { json } from "express";
import routes from "./Routes/routes";
import { GlobalErrors } from "./middlewares/middleware";
import helmet from "helmet";
import cors from "cors";

export const app = express();
app.use(helmet());
app.use(json());
app.use(cors());
const globalErrors = new GlobalErrors();

app.use(routes);

app.use(globalErrors.handleErrors);
