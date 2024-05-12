import express, { Request, Response } from "express";
import http from "http";
import compression from "compression";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import MainRoute from "./routers/mainRoute";
import { rateLimit } from "express-rate-limit";

const app = express();
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
    cors({
        credentials: true,
    })
);

app.post("/test", (req: Request, res: Response) => {
    console.log(req.body);
    res.status(200).json(req.body);
});

const server = http.createServer(app);

server.listen(8080, () => {
    console.log("Server running on http://localhost:8080/");
});

const MONGO_URL =
    "mongodb+srv://user:9xLY1kxogNt7uAq2@cluster0.ny3tbsu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error: Error) => console.log(error));

app.use(MainRoute());
