import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes";
import videoRouter from "./routes/video.routes";
import playlistRouter from "./routes/playlist.routes"
import subscriptionRouter from "./routes/subscription.routes";
import commentRouter from "./routes/comment.routes";
import tweetRouter from "./routes/tweet.routes";
import likeRouter from "./routes/like.routes";

const app = express();

app.use(helmet())
app.use(morgan("dev"))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

app.use("/api/users", userRouter);
app.use("/api/videos", videoRouter);
app.use("/api/playlist", playlistRouter);
app.use("/api/subscription", subscriptionRouter);
app.use("/api/comments", commentRouter);
app.use("/api/tweets", tweetRouter);
app.use("/api/likes", likeRouter);

export default app;