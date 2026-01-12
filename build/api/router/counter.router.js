"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CounterRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_token_1 = require("../middleware/auth.token");
const counter_club_controller_1 = require("../controller/counter-club.controller");
let router = express_1.default.Router();
exports.CounterRouter = router;
// Unity
router.get("/dashboard", auth_token_1.verifyAccessTokenRestApi, counter_club_controller_1.dashboardClubController);
router.put("/coin-send", auth_token_1.verifyAccessTokenRestApi, counter_club_controller_1.chipSendOutClubController);
router.put("/claim-send", auth_token_1.verifyAccessTokenRestApi, counter_club_controller_1.chipClaimBackClubController);
router.post("/transaction", auth_token_1.verifyAccessTokenRestApi, counter_club_controller_1.transactionClubController);
//# sourceMappingURL=counter.router.js.map