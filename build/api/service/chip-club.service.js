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
exports.addChipService = exports.chipAcceptDeclineService = exports.chipRequestListService = exports.chipRequestService = void 0;
const standard_error_1 = __importDefault(require("src/common/standard-error"));
const error_type_1 = require("src/common/error-type");
const club_user_repository_1 = require("src/repository/club-user.repository");
const chip_request_repository_1 = require("src/repository/chip-request.repository");
const chip_transaction_entity_1 = require("src/domain/chip-transaction.entity");
const chip_transaction_repository_1 = require("src/repository/chip-transaction.repository");
const club_user_entity_1 = require("src/domain/club-user.entity");
function chipRequestService(data) {
    var _a, _b, _c, _d, _e, _f, _g;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { clubId, USER_CLUB_ID, CHIP } = data;
            const getUser = yield (0, club_user_repository_1.getUserType)({
                where: { ID: USER_CLUB_ID }, relations: ['REFERRED_ID']
            });
            if ((getUser === null || getUser === void 0 ? void 0 : getUser.TYPE) === "Player") {
                if (((_a = getUser === null || getUser === void 0 ? void 0 : getUser.REFERRED_ID) === null || _a === void 0 ? void 0 : _a.TYPE) === "Owner") {
                    const requestData = {
                        CLUB_ID: clubId,
                        REQUEST_CLUB_USER_ID: USER_CLUB_ID,
                        RECEIVER_CLUB_USER_ID: (_b = getUser === null || getUser === void 0 ? void 0 : getUser.REFERRED_ID) === null || _b === void 0 ? void 0 : _b.ID,
                        CHIP: CHIP,
                        IS_AGENT: false
                    };
                    return yield (0, chip_request_repository_1.insertOneChip)(requestData);
                }
                else if (((_c = getUser === null || getUser === void 0 ? void 0 : getUser.REFERRED_ID) === null || _c === void 0 ? void 0 : _c.TYPE) === "Agent") {
                    const requestData = {
                        CLUB_ID: clubId,
                        REQUEST_CLUB_USER_ID: USER_CLUB_ID,
                        RECEIVER_CLUB_USER_ID: (_d = getUser === null || getUser === void 0 ? void 0 : getUser.REFERRED_ID) === null || _d === void 0 ? void 0 : _d.ID,
                        CHIP: CHIP,
                        IS_AGENT: true
                    };
                    return yield (0, chip_request_repository_1.insertOneChip)(requestData);
                }
            }
            else if ((getUser === null || getUser === void 0 ? void 0 : getUser.TYPE) === "Agent") {
                if (((_e = getUser === null || getUser === void 0 ? void 0 : getUser.REFERRED_ID) === null || _e === void 0 ? void 0 : _e.TYPE) === "Owner") {
                    const requestData = {
                        CLUB_ID: clubId,
                        REQUEST_CLUB_USER_ID: USER_CLUB_ID,
                        RECEIVER_CLUB_USER_ID: (_f = getUser === null || getUser === void 0 ? void 0 : getUser.REFERRED_ID) === null || _f === void 0 ? void 0 : _f.ID,
                        CHIP: CHIP,
                        IS_AGENT: false
                    };
                    return yield (0, chip_request_repository_1.insertOneChip)(requestData);
                }
            }
            else {
                throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, "Chip Service is not reachable.");
            }
        }
        catch (error) {
            throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, (_g = error === null || error === void 0 ? void 0 : error.message) !== null && _g !== void 0 ? _g : "Club Service is not reachable.");
        }
    });
}
exports.chipRequestService = chipRequestService;
function chipRequestListService(data) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { clubId, USER_CLUB_ID } = data;
            const chipRequestList = yield (0, chip_request_repository_1.getRequestChip)({ USER_CLUB_ID: USER_CLUB_ID });
            return { chipRequestList };
        }
        catch (error) {
            throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Club Service is not reachable.");
        }
    });
}
exports.chipRequestListService = chipRequestListService;
function chipAcceptDeclineService(data) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { clubId, USER_CLUB_ID, CHIP_REQUEST_ID, isAccept } = data;
            if (isAccept) {
                const getUser = yield (0, club_user_repository_1.getUserType)({
                    where: { ID: USER_CLUB_ID }
                });
                if (getUser.TYPE === "Owner") {
                    const chipAcceptDecline = yield (0, chip_request_repository_1.deleteChipRequest)({ ID: CHIP_REQUEST_ID });
                    const insertTransaction = [];
                    for (let index = 0; index < ((_a = chipAcceptDecline === null || chipAcceptDecline === void 0 ? void 0 : chipAcceptDecline.raw) === null || _a === void 0 ? void 0 : _a.length); index++) {
                        const RECEIVER = (_c = (_b = chipAcceptDecline === null || chipAcceptDecline === void 0 ? void 0 : chipAcceptDecline.raw) === null || _b === void 0 ? void 0 : _b[index]) === null || _c === void 0 ? void 0 : _c.REQUEST_CLUB_USER_ID;
                        const SENDER = (_e = (_d = chipAcceptDecline === null || chipAcceptDecline === void 0 ? void 0 : chipAcceptDecline.raw) === null || _d === void 0 ? void 0 : _d[index]) === null || _e === void 0 ? void 0 : _e.RECEIVER_CLUB_USER_ID;
                        const CHIP = (_g = (_f = chipAcceptDecline === null || chipAcceptDecline === void 0 ? void 0 : chipAcceptDecline.raw) === null || _f === void 0 ? void 0 : _f[index]) === null || _g === void 0 ? void 0 : _g.CHIP;
                        insertTransaction.push({
                            RECEIVER,
                            SENDER,
                            CHIP,
                            TRANSACTION_TYPE: chip_transaction_entity_1.TransactionType.CHIP_SEND
                        });
                        const getAgentUser = yield (0, club_user_repository_1.getUserType)({
                            where: { ID: RECEIVER }
                        });
                        if ((getAgentUser === null || getAgentUser === void 0 ? void 0 : getAgentUser.TYPE) === club_user_entity_1.UserType.AGENT) {
                            yield (0, club_user_repository_1.addAgentChip)({ CHIP: CHIP }, { ID: [RECEIVER] });
                        }
                        else {
                            yield (0, club_user_repository_1.addChip)({ CHIP: CHIP }, { ID: [RECEIVER] });
                        }
                    }
                    yield (0, chip_transaction_repository_1.insertManyTransaction)(insertTransaction);
                    return { status: true, message: "Add Chip" };
                }
                else if (getUser.TYPE === "Agent") {
                    let getChips = yield (0, chip_request_repository_1.getChipRequestList)({ ID: CHIP_REQUEST_ID });
                    let sum = getChips === null || getChips === void 0 ? void 0 : getChips.reduce((prev, current) => {
                        return prev + (current === null || current === void 0 ? void 0 : current.CHIP);
                    }, 0);
                    if (sum > (getUser === null || getUser === void 0 ? void 0 : getUser.AGENT_CHIP)) {
                        throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, "Chip is not sufficient.");
                    }
                    const chipAcceptDecline = yield (0, chip_request_repository_1.deleteChipRequest)({ ID: CHIP_REQUEST_ID });
                    const insertTransaction = [];
                    for (let index = 0; index < ((_h = chipAcceptDecline === null || chipAcceptDecline === void 0 ? void 0 : chipAcceptDecline.raw) === null || _h === void 0 ? void 0 : _h.length); index++) {
                        const RECEIVER = (_k = (_j = chipAcceptDecline === null || chipAcceptDecline === void 0 ? void 0 : chipAcceptDecline.raw) === null || _j === void 0 ? void 0 : _j[index]) === null || _k === void 0 ? void 0 : _k.REQUEST_CLUB_USER_ID;
                        const SENDER = (_m = (_l = chipAcceptDecline === null || chipAcceptDecline === void 0 ? void 0 : chipAcceptDecline.raw) === null || _l === void 0 ? void 0 : _l[index]) === null || _m === void 0 ? void 0 : _m.RECEIVER_CLUB_USER_ID;
                        const CHIP = (_p = (_o = chipAcceptDecline === null || chipAcceptDecline === void 0 ? void 0 : chipAcceptDecline.raw) === null || _o === void 0 ? void 0 : _o[index]) === null || _p === void 0 ? void 0 : _p.CHIP;
                        insertTransaction.push({
                            RECEIVER,
                            SENDER,
                            CHIP,
                            TRANSACTION_TYPE: chip_transaction_entity_1.TransactionType.CHIP_SEND
                        });
                        yield (0, club_user_repository_1.addChip)({ CHIP: CHIP }, { ID: [RECEIVER] });
                    }
                    yield (0, chip_transaction_repository_1.insertManyTransaction)(insertTransaction);
                    yield (0, club_user_repository_1.subtractAgentChip)({ CHIP: sum }, { ID: [getUser.ID] });
                    return { status: true, message: "Add Chip" };
                }
            }
            else {
                const chipAcceptDecline = yield (0, chip_request_repository_1.deleteChipRequest)({ ID: CHIP_REQUEST_ID });
                return { status: false, message: "Chip Request Successfully Decline." };
            }
        }
        catch (error) {
            throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, (_q = error === null || error === void 0 ? void 0 : error.message) !== null && _q !== void 0 ? _q : "Club Service is not reachable.");
        }
    });
}
exports.chipAcceptDeclineService = chipAcceptDeclineService;
function addChipService(data) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { USER_CLUB_ID, CHIP, type } = data;
            if (type === "add") {
                yield (0, club_user_repository_1.addChip)({ CHIP: CHIP }, { ID: [USER_CLUB_ID] });
                return { message: "Add Chip" };
            }
            else if (type === "subtract") {
                yield (0, club_user_repository_1.subtractChip)({ CHIP: CHIP }, { ID: [USER_CLUB_ID] });
                return { message: "Subtract Chip" };
            }
            else {
                throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, "Chip Service is not reachable.");
            }
        }
        catch (error) {
            throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Add and Subtract Service are not reachable.");
        }
    });
}
exports.addChipService = addChipService;
//# sourceMappingURL=chip-club.service.js.map