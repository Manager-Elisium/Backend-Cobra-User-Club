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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionClub = exports.chipClaimBackClub = exports.chipSendOutClub = exports.getClubAndUserType = void 0;
const club_user_repository_1 = require("src/repository/club-user.repository");
const error_type_1 = require("src/common/error-type");
const standard_error_1 = __importDefault(require("src/common/standard-error"));
const club_request_repository_1 = require("src/repository/club-request.repository");
const chip_transaction_entity_1 = require("src/domain/chip-transaction.entity");
const chip_transaction_repository_1 = require("src/repository/chip-transaction.repository");
const chip_request_repository_1 = require("src/repository/chip-request.repository");
const club_user_entity_1 = require("src/domain/club-user.entity");
function getClubAndUserType(data) {
    var _a, _b, _c, _d, _e, _f, _g;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const getUserTypo = yield (0, club_user_repository_1.getUserType)({
                where: { USER_ID: data === null || data === void 0 ? void 0 : data.USER_ID, CLUB_ID: data === null || data === void 0 ? void 0 : data.clubId }
            });
            // owner-1) unlimited (manthan), 2) agent (total chip), 3) player (total chip), 4) current chip (khud player)
            // agent-1) agent - player(total chip), 2) agent current chip (send player chip), 3) current chip (khub player)
            if ((getUserTypo === null || getUserTypo === void 0 ? void 0 : getUserTypo.TYPE) === "Owner") {
                const getDashBoard = yield (0, club_user_repository_1.getTypeSumByClubIdForOwner)(data === null || data === void 0 ? void 0 : data.clubId);
                const getPlayerTypo = yield (0, club_user_repository_1.getUserType)({
                    where: { USER_ID: data === null || data === void 0 ? void 0 : data.USER_ID, CLUB_ID: data === null || data === void 0 ? void 0 : data.clubId, TYPE: club_user_entity_1.UserType.PLAYER }
                });
                const allTypes = ["Owner", "Agent", "Player"];
                const currentResultMap = new Map(getDashBoard.map(item => [item.TYPE, item]));
                console.log(`currentResultMap ::: `, currentResultMap);
                let agent_as_player = 0;
                const finalResult = allTypes.map(type => {
                    var _a, _b, _c, _d;
                    if (type === "Agent") {
                        agent_as_player += Number((_b = (_a = ((currentResultMap === null || currentResultMap === void 0 ? void 0 : currentResultMap.get(type)) || { CHIP: "0" })) === null || _a === void 0 ? void 0 : _a.CHIP) !== null && _b !== void 0 ? _b : "0");
                        return {
                            TYPE: type,
                            CHIP: (_d = (_c = ((currentResultMap === null || currentResultMap === void 0 ? void 0 : currentResultMap.get(type)) || { CHIP: "0" })) === null || _c === void 0 ? void 0 : _c.AGENT_CHIP) !== null && _d !== void 0 ? _d : "0"
                        };
                    }
                    else {
                        return {
                            TYPE: type,
                            CHIP: (Number((currentResultMap.get(type) || { CHIP: "0" }).CHIP) + agent_as_player).toString()
                        };
                    }
                });
                finalResult.push({
                    TYPE: "Own Player",
                    CHIP: (_b = (_a = getPlayerTypo === null || getPlayerTypo === void 0 ? void 0 : getPlayerTypo.CHIP) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "0"
                });
                console.log(`Final Result ::: `, finalResult);
                const countInvitedClubPlayer = yield (0, club_request_repository_1.countInvitedClubUser)({ USER_ID: data === null || data === void 0 ? void 0 : data.USER_ID });
                const countChipRequest = yield (0, chip_request_repository_1.countChipRequestClubUser)({ USER_CLUB_ID: getUserTypo === null || getUserTypo === void 0 ? void 0 : getUserTypo.ID });
                return { message: "Owner Dashboard", getDashBoard: finalResult, countInvitedClubPlayer, countChipRequest };
            }
            else if ((getUserTypo === null || getUserTypo === void 0 ? void 0 : getUserTypo.TYPE) === "Agent") {
                const getDashBoard = yield (0, club_user_repository_1.getTypeSumByClubIdForAgent)(data === null || data === void 0 ? void 0 : data.clubId, getUserTypo === null || getUserTypo === void 0 ? void 0 : getUserTypo.ID);
                const allTypes = ["Player"];
                const currentResultMap = new Map(getDashBoard.map(item => [item.TYPE, item]));
                const finalResult = allTypes.map(type => ({
                    TYPE: type,
                    CHIP: (currentResultMap.get(type) || { CHIP: "0" }).CHIP
                }));
                finalResult.push({
                    TYPE: "Current Agent Chip",
                    CHIP: (_d = (_c = getUserTypo === null || getUserTypo === void 0 ? void 0 : getUserTypo.AGENT_CHIP) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : "0"
                });
                finalResult.push({
                    TYPE: "Current Player Chip",
                    CHIP: (_f = (_e = getUserTypo === null || getUserTypo === void 0 ? void 0 : getUserTypo.CHIP) === null || _e === void 0 ? void 0 : _e.toString()) !== null && _f !== void 0 ? _f : "0"
                });
                console.log(`getDashBoard ::: `, getDashBoard);
                console.log(`getUserTypo?.TYPE ::::: `, finalResult);
                const countInvitedClubPlayer = yield (0, club_request_repository_1.countInvitedClubUser)({ USER_ID: data === null || data === void 0 ? void 0 : data.USER_ID });
                const countChipRequest = yield (0, chip_request_repository_1.countChipRequestClubUser)({ USER_CLUB_ID: getUserTypo === null || getUserTypo === void 0 ? void 0 : getUserTypo.ID });
                return { message: "Agent Dashboard", getDashBoard: finalResult, countInvitedClubPlayer, countChipRequest };
            }
            else if ((getUserTypo === null || getUserTypo === void 0 ? void 0 : getUserTypo.TYPE) === "Player") {
                const getDashBoard = yield (0, club_user_repository_1.getTypeSumByClubIdForPlayer)(data === null || data === void 0 ? void 0 : data.clubId, data === null || data === void 0 ? void 0 : data.USER_ID);
                return { message: "Player Dashboard", getDashBoard };
            }
            else {
                throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, "User Type Service.");
            }
        }
        catch (error) {
            throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, (_g = error === null || error === void 0 ? void 0 : error.message) !== null && _g !== void 0 ? _g : "Dashboard User Service.");
        }
    });
}
exports.getClubAndUserType = getClubAndUserType;
function chipSendOutClub(data) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { USER_CLUB_ID, CHIP, USER_ID } = data;
            const getUserTypo = yield (0, club_user_repository_1.getUserType)({
                where: { USER_ID: USER_ID, CLUB_ID: data === null || data === void 0 ? void 0 : data.clubId }
            });
            let totalChip = 0;
            const insertTransaction = [];
            for (let index = 0; index < USER_CLUB_ID.length; index++) {
                const RECEIVER = USER_CLUB_ID[index];
                if ((getUserTypo === null || getUserTypo === void 0 ? void 0 : getUserTypo.TYPE) === "Owner") {
                    const getUserOwnerTypo = yield (0, club_user_repository_1.getUserType)({
                        where: { ID: RECEIVER }
                    });
                    if ((getUserOwnerTypo === null || getUserOwnerTypo === void 0 ? void 0 : getUserOwnerTypo.TYPE) === club_user_entity_1.UserType.AGENT) {
                        USER_CLUB_ID.splice(index, 1);
                        const addChipPlayerAndAgent = yield (0, club_user_repository_1.addAgentChip)({ CHIP: CHIP }, { ID: [getUserOwnerTypo.ID] });
                    }
                }
                if ((getUserTypo === null || getUserTypo === void 0 ? void 0 : getUserTypo.TYPE) === "Agent" && (getUserTypo === null || getUserTypo === void 0 ? void 0 : getUserTypo.ID) === RECEIVER) {
                    if (getUserTypo.AGENT_CHIP >= totalChip) {
                        USER_CLUB_ID.splice(index, 1);
                        const addChipPlayerForAgent = yield (0, club_user_repository_1.addChip)({ CHIP: CHIP }, { ID: [RECEIVER] });
                        console.log(`addChipPlayerForAgent ::: `, addChipPlayerForAgent);
                        if (addChipPlayerForAgent === null || addChipPlayerForAgent === void 0 ? void 0 : addChipPlayerForAgent.affected) {
                            const subtractPlayerForAgent = yield (0, club_user_repository_1.subtractAgentChip)({ CHIP: CHIP }, { ID: [RECEIVER] });
                            console.log(`subtractPlayerForAgent ::: `, subtractPlayerForAgent);
                        }
                    }
                }
                insertTransaction.push({
                    RECEIVER, SENDER: getUserTypo.ID, CHIP, TRANSACTION_TYPE: chip_transaction_entity_1.TransactionType.CHIP_SEND
                });
                totalChip += CHIP;
            }
            if ((getUserTypo === null || getUserTypo === void 0 ? void 0 : getUserTypo.TYPE) === "Owner") {
                const addChipPlayerAndAgent = yield (0, club_user_repository_1.addChip)({ CHIP: CHIP }, { ID: USER_CLUB_ID });
                yield (0, chip_transaction_repository_1.insertManyTransaction)(insertTransaction);
                return { message: "Add Chip", addChipPlayerAndAgent, success: true };
            }
            else if ((getUserTypo === null || getUserTypo === void 0 ? void 0 : getUserTypo.TYPE) === "Agent") {
                if (getUserTypo.AGENT_CHIP >= totalChip) {
                    if ((USER_CLUB_ID === null || USER_CLUB_ID === void 0 ? void 0 : USER_CLUB_ID.length) > 0) {
                        yield (0, club_user_repository_1.addChip)({ CHIP: CHIP }, { ID: USER_CLUB_ID });
                        yield (0, club_user_repository_1.subtractAgentChip)({ CHIP: CHIP }, { ID: [getUserTypo === null || getUserTypo === void 0 ? void 0 : getUserTypo.ID] });
                    }
                    yield (0, chip_transaction_repository_1.insertManyTransaction)(insertTransaction);
                    return { message: "Add Chip", success: true };
                }
                else {
                    return { message: "You don't have enough chip.", success: false };
                }
            }
            else {
                throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, "Send Chip Service.");
            }
        }
        catch (error) {
            throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Send Chip Service.");
        }
    });
}
exports.chipSendOutClub = chipSendOutClub;
function chipClaimBackClub(data) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { USER_CLUB_ID, CHIP, USER_ID } = data;
            const getUserTypo = yield (0, club_user_repository_1.getUserType)({
                where: { USER_ID: USER_ID, CLUB_ID: data === null || data === void 0 ? void 0 : data.clubId }
            });
            let totalChip = 0;
            const insertTransaction = [];
            for (let index = 0; index < USER_CLUB_ID.length; index++) {
                const RECEIVER = USER_CLUB_ID[index];
                insertTransaction.push({
                    RECEIVER, SENDER: getUserTypo.ID, CHIP, TRANSACTION_TYPE: chip_transaction_entity_1.TransactionType.CLAIM_BACK
                });
                if ((getUserTypo === null || getUserTypo === void 0 ? void 0 : getUserTypo.TYPE) === "Owner") {
                    const getUserOwnerTypo = yield (0, club_user_repository_1.getUserType)({
                        where: { ID: RECEIVER }
                    });
                    if ((getUserOwnerTypo === null || getUserOwnerTypo === void 0 ? void 0 : getUserOwnerTypo.TYPE) === club_user_entity_1.UserType.AGENT) {
                        USER_CLUB_ID.splice(index, 1);
                        yield (0, club_user_repository_1.subtractAgentChip)({ CHIP: CHIP }, { ID: [getUserOwnerTypo.ID] });
                    }
                }
                totalChip += CHIP;
            }
            if ((getUserTypo === null || getUserTypo === void 0 ? void 0 : getUserTypo.TYPE) === "Owner") {
                const claimChipPlayerAndAgent = yield (0, club_user_repository_1.subtractChip)({ CHIP: CHIP }, { ID: USER_CLUB_ID });
                yield (0, chip_transaction_repository_1.insertManyTransaction)(insertTransaction);
                return { message: "Claim Chip", claimChipPlayerAndAgent };
            }
            else if ((getUserTypo === null || getUserTypo === void 0 ? void 0 : getUserTypo.TYPE) === "Agent") {
                yield (0, club_user_repository_1.subtractChip)({ CHIP: CHIP }, { ID: USER_CLUB_ID });
                yield (0, club_user_repository_1.addAgentChip)({ CHIP: totalChip }, { ID: [getUserTypo.ID] });
                yield (0, chip_transaction_repository_1.insertManyTransaction)(insertTransaction);
                return { message: "Claim Chip" };
            }
            else {
                throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, "Claim Chip Service.");
            }
        }
        catch (error) {
            throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Claim Chip Service.");
        }
    });
}
exports.chipClaimBackClub = chipClaimBackClub;
function transactionClub(data) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { USER_CLUB_ID, CHIP, CLUB: USER_ID, LIMIT, START, TRANSACTION_TYPE } = data;
            const getUserTypo = yield (0, club_user_repository_1.getUserType)({
                where: { USER_ID: USER_ID, CLUB_ID: data === null || data === void 0 ? void 0 : data.clubId }
            });
            if ((getUserTypo === null || getUserTypo === void 0 ? void 0 : getUserTypo.TYPE) === "Owner") {
                if (TRANSACTION_TYPE.toLowerCase() === "all") {
                    const transaction = yield (0, chip_transaction_repository_1.getAllTransactionOwner)({
                        SENDER_ID: getUserTypo === null || getUserTypo === void 0 ? void 0 : getUserTypo.ID,
                        TAKE: LIMIT,
                        SKIP: START
                    });
                    return { message: "Transaction", transaction };
                }
                else {
                    const transaction = yield (0, chip_transaction_repository_1.getTransactionOwner)({
                        TRANSACTION_TYPE,
                        SENDER_ID: getUserTypo === null || getUserTypo === void 0 ? void 0 : getUserTypo.ID,
                        TAKE: LIMIT,
                        SKIP: START
                    });
                    return { message: "Transaction", transaction };
                }
            }
            else if ((getUserTypo === null || getUserTypo === void 0 ? void 0 : getUserTypo.TYPE) === "Agent") {
                if (TRANSACTION_TYPE.toLowerCase() === "all") {
                    const transaction = yield (0, chip_transaction_repository_1.getAllTransactionAgent)({
                        SENDER_ID: getUserTypo === null || getUserTypo === void 0 ? void 0 : getUserTypo.ID,
                        TAKE: LIMIT,
                        SKIP: START
                    });
                    return { message: "Transaction", transaction };
                }
                else {
                    const transaction = yield (0, chip_transaction_repository_1.getTransactionOwner)({
                        TRANSACTION_TYPE,
                        SENDER_ID: getUserTypo === null || getUserTypo === void 0 ? void 0 : getUserTypo.ID,
                        TAKE: LIMIT,
                        SKIP: START
                    });
                    return { message: "Transaction", transaction };
                }
            }
            else {
                if (TRANSACTION_TYPE.toLowerCase() === "all") {
                    const transaction = yield (0, chip_transaction_repository_1.getAllTransactionPlayer)({
                        SENDER_ID: getUserTypo === null || getUserTypo === void 0 ? void 0 : getUserTypo.ID,
                        TAKE: LIMIT,
                        SKIP: START
                    });
                    return { message: "Player Transaction", transaction };
                }
                else {
                    const transaction = yield (0, chip_transaction_repository_1.getTransactionPlayer)({
                        TRANSACTION_TYPE,
                        SENDER_ID: getUserTypo === null || getUserTypo === void 0 ? void 0 : getUserTypo.ID,
                        TAKE: LIMIT,
                        SKIP: START
                    });
                    return { message: "Player Transaction", transaction };
                }
            }
        }
        catch (error) {
            throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Claim Chip Service.");
        }
    });
}
exports.transactionClub = transactionClub;
//# sourceMappingURL=counter.service.js.map