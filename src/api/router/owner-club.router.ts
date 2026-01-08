import express from "express";
import { createClub, updateClub, updateNoticeClub } from "../controller/owner-club.controller";
import { verifyAccessTokenRestApi } from "../middleware/auth.token";
let router = express.Router();

// Unity
router.post("/create", verifyAccessTokenRestApi, createClub);

router.put("/update", verifyAccessTokenRestApi, updateClub);

router.put("/update-notice", verifyAccessTokenRestApi, updateNoticeClub);

router.put("/detail", verifyAccessTokenRestApi, updateClub);

export { router as ClubRouter };