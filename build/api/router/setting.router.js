"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_token_1 = require("../middleware/auth.token");
const setting_club_controller_1 = require("../controller/setting-club.controller");
let router = express_1.default.Router();
exports.SettingRouter = router;
// Unity
router.put("/update", auth_token_1.verifyAccessTokenRestApi, setting_club_controller_1.settingClubController);
//# sourceMappingURL=setting.router.js.map