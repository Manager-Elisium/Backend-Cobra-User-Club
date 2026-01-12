"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAndReturnByIdTableController = exports.getUserAndClubByIdController = exports.getOneTableController = exports.detailTable = exports.createTable = void 0;
const encrypt_1 = require("src/common/encrypt");
const table_service_1 = require("../service/table.service");
const club_table_repository_1 = require("src/repository/club-table.repository");
const secretKey = 'SM20zD0thg8T5Gz3scOSQ2W4r6r7GJqR';
function createTable(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { public_key, content, token } = req.body;
            let decryptBody = yield (0, encrypt_1.decrypt)({ public_key, content }, secretKey);
            const { DESIGN_TYPE, NO_OF_PLAYER, TURN_TIME, NAME, ENTRY_FEES, RAKE, IN_GAME_INTERACTIONS, CLUB_ID, TABLE_ID } = JSON.parse(decryptBody);
            let createTable = yield (0, table_service_1.createTableService)({
                NAME, DESIGN_TYPE,
                NO_OF_PLAYER,
                TURN_TIME,
                ENTRY_FEES,
                RAKE,
                IN_GAME_INTERACTIONS,
                CLUB_ID, USER_ID: token === null || token === void 0 ? void 0 : token.ID, TABLE_ID
            });
            return res.send(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: true, createTable, message: "Create Table" }), secretKey));
        }
        catch (error) {
            return res.json(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "" }), secretKey));
        }
    });
}
exports.createTable = createTable;
function detailTable(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token } = req.body;
            const { clubId, tableNumber, isRunningTable } = req.query;
            let { getClub, listTableDetails } = yield (0, table_service_1.getTableListService)({ clubId, USER_ID: token === null || token === void 0 ? void 0 : token.ID, tableNumber, isRunningTable: (isRunningTable === null || isRunningTable === void 0 ? void 0 : isRunningTable.toString().toLowerCase()) === "true" ? true : false });
            return res.send(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: true, getClub, listTableDetails, message: "Table Details" }), secretKey));
        }
        catch (error) {
            return res.json(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "" }), secretKey));
        }
    });
}
exports.detailTable = detailTable;
function getOneTableController(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { tableId } = req.query;
            const getTable = yield (0, club_table_repository_1.getOneTable)({ where: { ID: tableId } });
            return res.send({ status: true, getTable, message: "Table Details" });
        }
        catch (error) {
            return res.json({ status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "" });
        }
    });
}
exports.getOneTableController = getOneTableController;
function getUserAndClubByIdController(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { tableId } = req.params;
            const getTableAndClub = yield (0, club_table_repository_1.getUserAndClubById)(tableId);
            return res.send({ status: true, getTableAndClub, message: "Table Details" });
        }
        catch (error) {
            return res.json({ status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "" });
        }
    });
}
exports.getUserAndClubByIdController = getUserAndClubByIdController;
function updateAndReturnByIdTableController(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { tableId } = req.params;
            const updateTable = yield (0, club_table_repository_1.updateAndReturnByIdTable)(tableId, req.body);
            return res.send({ status: true, updateTable, message: "Table Details" });
        }
        catch (error) {
            return res.json({ status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "" });
        }
    });
}
exports.updateAndReturnByIdTableController = updateAndReturnByIdTableController;
//# sourceMappingURL=table-club.controller.js.map