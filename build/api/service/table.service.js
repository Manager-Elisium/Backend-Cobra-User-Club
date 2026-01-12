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
exports.getTableListService = exports.createTableService = void 0;
const standard_error_1 = __importDefault(require("src/common/standard-error"));
const error_type_1 = require("src/common/error-type");
const club_table_repository_1 = require("src/repository/club-table.repository");
const club_user_repository_1 = require("src/repository/club-user.repository");
const club_user_entity_1 = require("src/domain/club-user.entity");
function createTableService(data) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { NAME } = data;
            const query = {
                where: {
                    NAME
                }
            };
            const isPresent = yield (0, club_table_repository_1.countTable)(query);
            if (isPresent) {
                throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, "Table Name is exists.");
            }
            const setData = {
                DESIGN_TYPE: data === null || data === void 0 ? void 0 : data.DESIGN_TYPE,
                NO_OF_PLAYER: data === null || data === void 0 ? void 0 : data.NO_OF_PLAYER,
                TURN_TIME: data === null || data === void 0 ? void 0 : data.TURN_TIME,
                NAME: data === null || data === void 0 ? void 0 : data.NAME,
                ENTRY_FEES: data === null || data === void 0 ? void 0 : data.ENTRY_FEES,
                RAKE: data === null || data === void 0 ? void 0 : data.RAKE,
                IN_GAME_INTERACTIONS: data === null || data === void 0 ? void 0 : data.IN_GAME_INTERACTIONS,
                CLUB_ID: data === null || data === void 0 ? void 0 : data.CLUB_ID,
                TABLE_ID: data === null || data === void 0 ? void 0 : data.TABLE_ID
            };
            const create = yield (0, club_table_repository_1.insertTable)(setData);
            if (!create) {
                throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, "Table is not created.");
            }
            return create;
        }
        catch (error) {
            throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Table is not created.");
        }
    });
}
exports.createTableService = createTableService;
function getTableListService(data) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { clubId, USER_ID, tableNumber, isRunningTable } = data;
            const query = !!tableNumber ? {
                where: {
                    NO_OF_PLAYER: parseInt(tableNumber),
                    IN_RUNNING_TABLE: isRunningTable,
                    CLUB_ID: clubId
                },
                relations: ['CLUB_ID']
            } : {
                where: {
                    IN_RUNNING_TABLE: isRunningTable,
                    CLUB_ID: clubId
                },
                relations: ['CLUB_ID']
            };
            const getClub = yield (0, club_user_repository_1.getUserDetailClub)({
                where: { USER_ID, CLUB_ID: clubId, IS_DELETE: false },
                relations: ['CLUB_ID']
            });
            const listTableDetails = yield (0, club_table_repository_1.listTable)(query);
            console.log(`getClub :::: `, getClub === null || getClub === void 0 ? void 0 : getClub.some((data) => data.TYPE === club_user_entity_1.UserType.OWNER));
            if (getClub === null || getClub === void 0 ? void 0 : getClub.some((data) => data.TYPE === club_user_entity_1.UserType.OWNER)) {
                const getPlayerChip = getClub === null || getClub === void 0 ? void 0 : getClub.find((data) => data.TYPE === club_user_entity_1.UserType.PLAYER);
                const ownerPlayer = getClub === null || getClub === void 0 ? void 0 : getClub.find((data) => data.TYPE === club_user_entity_1.UserType.OWNER);
                return { getClub: [Object.assign(Object.assign({}, ownerPlayer), { PLAYER_ID: getPlayerChip === null || getPlayerChip === void 0 ? void 0 : getPlayerChip.ID, CHIP: getPlayerChip === null || getPlayerChip === void 0 ? void 0 : getPlayerChip.CHIP })], listTableDetails };
            }
            else {
                return { getClub, listTableDetails };
            }
        }
        catch (error) {
            throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Table List is not found.");
        }
    });
}
exports.getTableListService = getTableListService;
//# sourceMappingURL=table.service.js.map