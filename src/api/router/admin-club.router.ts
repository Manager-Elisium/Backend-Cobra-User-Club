import express from "express";
import { adminClubController } from "../controller/admin-club.controller";
import { verifyAccessTokenRestApi } from "../middleware/auth.token";
import { acceptDeclineRequestClub, invitedClub, joinClub, listClub, requestedClub, searchClub } from "../controller/owner-club.controller";
let router = express.Router();

// Admin
router.get("/get-user-club-detail", adminClubController);

router.get("/get-user-clubs-detail", verifyAccessTokenRestApi, listClub);

router.get("/search", verifyAccessTokenRestApi, searchClub);

router.get("/join", verifyAccessTokenRestApi, joinClub);

router.get("/requested-user", verifyAccessTokenRestApi, requestedClub);

router.get("/invited-user", verifyAccessTokenRestApi, invitedClub);

router.get("/request-accept-decline", verifyAccessTokenRestApi, acceptDeclineRequestClub);

export { router as AdminClubRouter };