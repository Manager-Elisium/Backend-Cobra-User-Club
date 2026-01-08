import { NextFunction, Response, Request } from "express";
import { encrypt, decrypt } from "src/common/encrypt";
import { createTableService, getTableListService } from "../service/table.service";
import { getOneTable, getUserAndClubById, updateAndReturnByIdTable } from "src/repository/club-table.repository";
const secretKey = 'SM20zD0thg8T5Gz3scOSQ2W4r6r7GJqR';

async function createTable(req: Request, res: Response, next: NextFunction) {
    try {
        const { public_key, content, token } = req.body;
        let decryptBody: any = await decrypt({ public_key, content }, secretKey);
        const {
            DESIGN_TYPE,
            NO_OF_PLAYER,
            TURN_TIME,
            NAME,
            ENTRY_FEES,
            RAKE,
            IN_GAME_INTERACTIONS,
            CLUB_ID, TABLE_ID } = JSON.parse(decryptBody);
        let createTable = await createTableService({
            NAME, DESIGN_TYPE,
            NO_OF_PLAYER,
            TURN_TIME,
            ENTRY_FEES,
            RAKE,
            IN_GAME_INTERACTIONS,
            CLUB_ID, USER_ID: token?.ID, TABLE_ID
        });
        return res.send(await encrypt(JSON.stringify({ status: true, createTable, message: "Create Table" }), secretKey));
    } catch (error) {
        return res.json(await encrypt(JSON.stringify({ status: false, message: error?.message ?? "" }), secretKey));
    }
}


async function detailTable(req: Request, res: Response, next: NextFunction) {
    try {
        const { token } = req.body;
        const { clubId, tableNumber, isRunningTable } = req.query;
        let { getClub, listTableDetails } = await getTableListService({ clubId, USER_ID: token?.ID, tableNumber, isRunningTable: isRunningTable?.toString().toLowerCase() === "true" ? true : false });
        return res.send(await encrypt(JSON.stringify({ status: true, getClub, listTableDetails, message: "Table Details" }), secretKey));
    } catch (error) {
        return res.json(await encrypt(JSON.stringify({ status: false, message: error?.message ?? "" }), secretKey));
    }
}


async function getOneTableController(req: Request, res: Response, next: NextFunction) {
    try {
        const { tableId } = req.query;
        const getTable = await getOneTable({ where: { ID: tableId } });
        return res.send({ status: true, getTable, message: "Table Details" });
    } catch (error) {
        return res.json({ status: false, message: error?.message ?? "" });
    }
}


async function getUserAndClubByIdController(req: Request, res: Response, next: NextFunction) {
    try {
        const { tableId } = req.params;
        const getTableAndClub = await getUserAndClubById(tableId);
        return res.send({ status: true, getTableAndClub, message: "Table Details" });
    } catch (error) {
        return res.json({ status: false, message: error?.message ?? "" });
    }
}


async function updateAndReturnByIdTableController(req: Request, res: Response, next: NextFunction) {
    try {
        const { tableId } = req.params;
        const updateTable = await updateAndReturnByIdTable(tableId, req.body);
        return res.send({ status: true, updateTable, message: "Table Details" });
    } catch (error) {
        return res.json({ status: false, message: error?.message ?? "" });
    }
}


export { createTable, detailTable, getOneTableController, getUserAndClubByIdController, updateAndReturnByIdTableController };