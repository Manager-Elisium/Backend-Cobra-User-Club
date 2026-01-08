import express from "express";
import { verifyAccessTokenRestApi } from "../middleware/auth.token";
import { acceptDeclineRequestClub, joinClub, requestedClub, requestedListClub } from "../controller/request-club.controller";
let router = express.Router();

router.get("/join-club", verifyAccessTokenRestApi, joinClub);

router.get("/request-club", verifyAccessTokenRestApi, requestedClub);

router.get("/request-accept-decline", verifyAccessTokenRestApi, acceptDeclineRequestClub);

router.get("/request-user-list", verifyAccessTokenRestApi, requestedListClub);

export { router as RequestClubRouter };