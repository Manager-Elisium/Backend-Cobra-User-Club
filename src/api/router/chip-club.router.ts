import express from "express";
import { verifyAccessTokenRestApi } from "../middleware/auth.token";
import { addChipRequestController, chipAcceptDeclineController, chipRequestListController, chipSendRequestController, subtractChipRequestController } from "../controller/chip-club.controller";
let router = express.Router();

// Unity
router.post("/send-request", verifyAccessTokenRestApi, chipSendRequestController);

router.post("/request-list", verifyAccessTokenRestApi, chipRequestListController);

router.post("/request-accept-decline", verifyAccessTokenRestApi, chipAcceptDeclineController);

router.post("/add-chip", addChipRequestController)

router.post("/subtract-chip", subtractChipRequestController)

export { router as ChipRequestRouter };