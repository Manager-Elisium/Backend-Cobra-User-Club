"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestClubRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_token_1 = require("../middleware/auth.token");
const request_club_controller_1 = require("../controller/request-club.controller");
let router = express_1.default.Router();
exports.RequestClubRouter = router;
router.get("/join-club", auth_token_1.verifyAccessTokenRestApi, request_club_controller_1.joinClub);
router.get("/request-club", auth_token_1.verifyAccessTokenRestApi, request_club_controller_1.requestedClub);
router.get("/request-accept-decline", auth_token_1.verifyAccessTokenRestApi, request_club_controller_1.acceptDeclineRequestClub);
router.get("/request-user-list", auth_token_1.verifyAccessTokenRestApi, request_club_controller_1.requestedListClub);
//# sourceMappingURL=request-club.router.js.map