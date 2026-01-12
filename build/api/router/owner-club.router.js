"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClubRouter = void 0;
const express_1 = __importDefault(require("express"));
const owner_club_controller_1 = require("../controller/owner-club.controller");
const auth_token_1 = require("../middleware/auth.token");
let router = express_1.default.Router();
exports.ClubRouter = router;
// Unity
router.post("/create", auth_token_1.verifyAccessTokenRestApi, owner_club_controller_1.createClub);
router.put("/update", auth_token_1.verifyAccessTokenRestApi, owner_club_controller_1.updateClub);
router.put("/update-notice", auth_token_1.verifyAccessTokenRestApi, owner_club_controller_1.updateNoticeClub);
router.put("/detail", auth_token_1.verifyAccessTokenRestApi, owner_club_controller_1.updateClub);
//# sourceMappingURL=owner-club.router.js.map