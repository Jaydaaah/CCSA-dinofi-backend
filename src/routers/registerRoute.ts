import AuthenticationMiddleware from "../middlewares/authentication";
import Register from "../controllers/Register";
import { Router } from "express";
import IsLogin from "../controllers/IsLogin";

const regRouter = (router: Router) => {
    router.post("/register", Register);
    router.get("/logged", IsLogin);

    return router;
};

export default regRouter;
