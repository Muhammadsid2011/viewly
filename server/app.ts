import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";

const app = express();

app.use(helmet())
app.use(morgan("dev"))
app.use(cookieParser())
app.use(express.json())

export default app;