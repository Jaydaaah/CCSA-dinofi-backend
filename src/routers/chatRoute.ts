import { Router } from "express";
import AuthenticationMiddleware from "../middlewares/authentication";
import ClientPrompt from "../controllers/Prompt";
import RetrieveData from "../controllers/RetrieveData";
import DeleteData from "../controllers/DeleteData";

const authRouter = (router: Router) => {
    // required user_id as query
    router.post("/chat", AuthenticationMiddleware, ClientPrompt);
    router.get("/chat", AuthenticationMiddleware, RetrieveData);
    router.delete("/chat", AuthenticationMiddleware, DeleteData);

    return router;
};

export default authRouter;
