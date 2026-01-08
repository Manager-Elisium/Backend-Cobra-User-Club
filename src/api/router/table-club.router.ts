import express from "express";
import { verifyAccessTokenRestApi } from "../middleware/auth.token";
import { createTable, detailTable, getOneTableController, getUserAndClubByIdController, updateAndReturnByIdTableController } from "../controller/table-club.controller";
let router = express.Router();

// Unity
router.post("/create", verifyAccessTokenRestApi, createTable);

router.get("/list", verifyAccessTokenRestApi, detailTable);

router.get("/get-table", getOneTableController);

router.get("/get-user-club/:tableId", getUserAndClubByIdController);

router.put("/update-table/:tableId", updateAndReturnByIdTableController);

export { router as TableRouter };