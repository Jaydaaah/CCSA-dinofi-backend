import express, { Express, Router } from "express";
import chatRoute from "./chatRoute";
import regRouter from "./registerRoute";

const MainRoute = () => {
    const router = Router();

    chatRoute(router);
    regRouter(router);

    return router;
};

export default MainRoute;
