"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChipRequestRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_token_1 = require("../middleware/auth.token");
const chip_club_controller_1 = require("../controller/chip-club.controller");
let router = express_1.default.Router();
exports.ChipRequestRouter = router;
// Unity
router.post("/send-request", auth_token_1.verifyAccessTokenRestApi, chip_club_controller_1.chipSendRequestController);
router.post("/request-list", auth_token_1.verifyAccessTokenRestApi, chip_club_controller_1.chipRequestListController);
router.post("/request-accept-decline", auth_token_1.verifyAccessTokenRestApi, chip_club_controller_1.chipAcceptDeclineController);
router.post("/add-chip", chip_club_controller_1.addChipRequestController);
router.post("/subtract-chip", chip_club_controller_1.subtractChipRequestController);
//# sourceMappingURL=chip-club.router.js.map