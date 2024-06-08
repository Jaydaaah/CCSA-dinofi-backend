import { Request, Response } from "express";
import { Logger, PrintFetch } from "../../debug/log";
import { GrogStreamPrompt } from "../../lib/Groq-api";

const log = Logger("QuickAskControl");

export default async function QuickAskControl(req: Request, res: Response)  {
    PrintFetch("PUT");

    const prompt: string = req.body["prompt"];

    if (!prompt) {
        const msg = "Please provide a prompt inside the request body";
        log(msg, "Red");
        return res.status(400).send(msg).end();
    }

    
    log("Groq Streaming Prompt started", "Blue");
    for await (var chunk of GrogStreamPrompt(prompt)) {
        res.write(chunk);
    }
    
    log("Finished", "Green");
    res.status(200).end();
}