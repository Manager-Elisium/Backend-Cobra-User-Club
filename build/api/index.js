"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = __importDefault(require("express"));
let router = express_1.default.Router();
exports.apiRouter = router;
// Create Club
const owner_club_router_1 = require("./router/owner-club.router");
router.use("/owner", owner_club_router_1.ClubRouter);
// Admin Show
const admin_club_router_1 = require("./router/admin-club.router");
router.use("/detail", admin_club_router_1.AdminClubRouter);
// Request 
const request_club_router_1 = require("./router/request-club.router");
router.use("/request", request_club_router_1.RequestClubRouter);
// Create Table
const table_club_router_1 = require("./router/table-club.router");
router.use("/table", table_club_router_1.TableRouter);
// Invited
const invited_router_1 = require("./router/invited.router");
router.use("/invited", invited_router_1.InvitedRouter);
const setting_router_1 = require("./router/setting.router");
router.use("/setting", setting_router_1.SettingRouter);
const counter_router_1 = require("./router/counter.router");
router.use("/counter", counter_router_1.CounterRouter);
const chip_club_router_1 = require("./router/chip-club.router");
router.use("/chip", chip_club_router_1.ChipRequestRouter);
router.use((req, res, next) => {
    next(res.status(404).json({ status: false, message: "Not Found." }));
});
//# sourceMappingURL=index.js.map