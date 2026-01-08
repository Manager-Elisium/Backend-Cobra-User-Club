import express from "express";
import { verifyAccessTokenRestApi } from "../middleware/auth.token";
import { joinClub, listInvitePlayerController, memberClubController, searchUserClub } from "../controller/invited.controller";
let router = express.Router();

// Unity
router.get("/member", verifyAccessTokenRestApi, memberClubController);

router.get("/new-players", verifyAccessTokenRestApi, listInvitePlayerController);

router.put("/join", verifyAccessTokenRestApi, joinClub);

router.get("/search", verifyAccessTokenRestApi, searchUserClub);

export { router as InvitedRouter };