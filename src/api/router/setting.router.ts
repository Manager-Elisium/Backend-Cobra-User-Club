import express from "express";
import { verifyAccessTokenRestApi } from "../middleware/auth.token";
import { settingClubController } from "../controller/setting-club.controller";
let router = express.Router();

// Unity
router.put("/update", verifyAccessTokenRestApi, settingClubController);


export { router as SettingRouter };