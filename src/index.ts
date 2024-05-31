import express, { Request, Response } from "express";
import http from "http";
import compression from "compression";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import MainRoute from "./routers/mainRoute";
import { Logger } from "./debug/log";

const Log = Logger("Main");

console.log();
Log("Starting...");


const app = express();
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
    cors({
        credentials: true,
    })
);

const server = http.createServer(app);

const MONGO_URL =
    "mongodb+srv://user:9xLY1kxogNt7uAq2@cluster0.ny3tbsu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

Log("Establishing MongoDB Connection...", "Yellow");
mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error: Error) => console.log(error));
Log("Connection Success", "Green");

server.listen(8080, () => {
    Log("Server is running on \x1b[36m http://localhost:8080/ \x1b[0m");
});

app.use(MainRoute());
