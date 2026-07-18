import express from "express";
import morgan from "morgan";
import helmet from "helmet";

const app = express();

app.use(helmet())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.static("public"))

export default app;