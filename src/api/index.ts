import express, { NextFunction, Response, Request } from "express";
let router = express.Router();

// Create Club
import { ClubRouter } from "./router/owner-club.router";
router.use("/owner", ClubRouter);

// Admin Show
import { AdminClubRouter } from "./router/admin-club.router";
router.use("/detail", AdminClubRouter);

// Request 
import { RequestClubRouter } from "./router/request-club.router";
router.use("/request", RequestClubRouter);

// Create Table
import { TableRouter } from "./router/table-club.router";
router.use("/table", TableRouter);

// Invited
import { InvitedRouter } from "./router/invited.router";
router.use("/invited", InvitedRouter);

import { SettingRouter } from "./router/setting.router";
router.use("/setting", SettingRouter);

import { CounterRouter } from "./router/counter.router";
router.use("/counter", CounterRouter);

import { ChipRequestRouter } from "./router/chip-club.router";
router.use("/chip", ChipRequestRouter);

router.use((req: Request, res: Response, next: NextFunction) => {
    next(res.status(404).json({ status: false, message: "Not Found." }));
});

export { router as apiRouter };
