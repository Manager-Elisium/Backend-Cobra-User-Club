"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminClubRouter = void 0;
const express_1 = __importDefault(require("express"));
const admin_club_controller_1 = require("../controller/admin-club.controller");
const auth_token_1 = require("../middleware/auth.token");
const owner_club_controller_1 = require("../controller/owner-club.controller");
let router = express_1.default.Router();
exports.AdminClubRouter = router;
// Admin
router.get("/get-user-club-detail", admin_club_controller_1.adminClubController);
router.get("/get-user-clubs-detail", auth_token_1.verifyAccessTokenRestApi, owner_club_controller_1.listClub);
router.get("/search", auth_token_1.verifyAccessTokenRestApi, owner_club_controller_1.searchClub);
router.get("/join", auth_token_1.verifyAccessTokenRestApi, owner_club_controller_1.joinClub);
router.get("/requested-user", auth_token_1.verifyAccessTokenRestApi, owner_club_controller_1.requestedClub);
router.get("/invited-user", auth_token_1.verifyAccessTokenRestApi, owner_club_controller_1.invitedClub);
router.get("/request-accept-decline", auth_token_1.verifyAccessTokenRestApi, owner_club_controller_1.acceptDeclineRequestClub);
//# sourceMappingURL=admin-club.router.js.map