"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitedRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_token_1 = require("../middleware/auth.token");
const invited_controller_1 = require("../controller/invited.controller");
let router = express_1.default.Router();
exports.InvitedRouter = router;
// Unity
router.get("/member", auth_token_1.verifyAccessTokenRestApi, invited_controller_1.memberClubController);
router.get("/new-players", auth_token_1.verifyAccessTokenRestApi, invited_controller_1.listInvitePlayerController);
router.put("/join", auth_token_1.verifyAccessTokenRestApi, invited_controller_1.joinClub);
router.get("/search", auth_token_1.verifyAccessTokenRestApi, invited_controller_1.searchUserClub);
//# sourceMappingURL=invited.router.js.map