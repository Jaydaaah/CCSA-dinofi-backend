import AuthenticationMiddleware from "../middlewares/authentication";
import RetrieveUser from "../controllers/user/Register";
import { Router } from "express";
import CreateChat from "../controllers/user/CreateChat";
import DeleteUserData from "../controllers/user/DeleteUserData";
import QuickAskControl from "../controllers/quick/QuickAskControl";

const regRouter = (router: Router) => {
    router.get("/reg", RetrieveUser);
    router.post("/reg", CreateChat);
    router.delete("/reg", DeleteUserData);

    router.put("/quick", QuickAskControl);

    return router;
};

export default regRouter;
