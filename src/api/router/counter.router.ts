import express from "express";
import { verifyAccessTokenRestApi } from "../middleware/auth.token";
import { chipClaimBackClubController, chipSendOutClubController, dashboardClubController, transactionClubController } from "../controller/counter-club.controller";
let router = express.Router();

// Unity
router.get("/dashboard", verifyAccessTokenRestApi, dashboardClubController);

router.put("/coin-send", verifyAccessTokenRestApi, chipSendOutClubController);

router.put("/claim-send", verifyAccessTokenRestApi, chipClaimBackClubController);

router.post("/transaction", verifyAccessTokenRestApi, transactionClubController);

export { router as CounterRouter };