"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_token_1 = require("../middleware/auth.token");
const table_club_controller_1 = require("../controller/table-club.controller");
let router = express_1.default.Router();
exports.TableRouter = router;
// Unity
router.post("/create", auth_token_1.verifyAccessTokenRestApi, table_club_controller_1.createTable);
router.get("/list", auth_token_1.verifyAccessTokenRestApi, table_club_controller_1.detailTable);
router.get("/get-table", table_club_controller_1.getOneTableController);
router.get("/get-user-club/:tableId", table_club_controller_1.getUserAndClubByIdController);
router.put("/update-table/:tableId", table_club_controller_1.updateAndReturnByIdTableController);
//# sourceMappingURL=table-club.router.js.map