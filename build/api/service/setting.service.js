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
exports.settingClubService = void 0;
const standard_error_1 = __importDefault(require("src/common/standard-error"));
const error_type_1 = require("src/common/error-type");
const club_user_repository_1 = require("src/repository/club-user.repository");
const club_user_entity_1 = require("src/domain/club-user.entity");
const chip_transaction_repository_1 = require("src/repository/chip-transaction.repository");
const club_table_repository_1 = require("src/repository/club-table.repository");
const chip_request_repository_1 = require("src/repository/chip-request.repository");
const club_request_repository_1 = require("src/repository/club-request.repository");
const request_repository_1 = require("src/repository/request.repository");
const club_repository_1 = require("src/repository/club.repository");
function settingClubService(data) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { clubId, USER_ID, USER_CLUB_ID } = data;
            const club_id = clubId;
            delete data.clubId, delete data.USER_ID, delete data.USER_CLUB_ID;
            const query = {
                ID: !!USER_CLUB_ID ? USER_CLUB_ID : USER_ID
            };
            if (!!data.TYPE) {
                if (data.TYPE === "Agent") {
                    data.TYPE = club_user_entity_1.UserType.AGENT;
                }
                else if (data.TYPE === "Player") {
                    data.TYPE = club_user_entity_1.UserType.PLAYER;
                }
            }
            if (!!data.IS_DELETE) {
                data.IS_DELETE = true;
                const getUserClub = yield (0, club_user_repository_1.getUserType)({
                    where: { ID: USER_CLUB_ID }
                });
                if ((getUserClub === null || getUserClub === void 0 ? void 0 : getUserClub.TYPE) === "Owner") {
                    // Delete All Data
                    // club table
                    // transaction
                    // chip request
                    // club request
                    // request
                    // player, agent, owner
                    // club
                    yield (0, club_table_repository_1.deleteAllTable)({ CLUB_ID: club_id });
                    yield (0, chip_transaction_repository_1.deleteAllTransaction)({ CLUB_ID: club_id });
                    yield (0, chip_request_repository_1.deleteAllChipRequest)({ CLUB_ID: club_id });
                    yield (0, club_request_repository_1.deleteAllClubRequest)({ CLUB_ID: club_id });
                    yield (0, request_repository_1.deleteRequestClub)({ CLUB_ID: club_id });
                    yield (0, club_user_repository_1.deleteUserClub)({ CLUB_ID: club_id });
                    yield (0, club_repository_1.deleteClubs)({ CLUB_ID: club_id });
                }
                else if ((getUserClub === null || getUserClub === void 0 ? void 0 : getUserClub.TYPE) === "Agent") {
                    // Under Remove All User
                    // agent , player update delete
                    // update : owner  
                    const getUser = yield (0, club_user_repository_1.updateUser)(query, data);
                    if (getUser === null || getUser === void 0 ? void 0 : getUser.affected) {
                        const whereUser = {
                            REFERRED_ID: (_b = (_a = getUser === null || getUser === void 0 ? void 0 : getUser.raw) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.ID
                        };
                        const updateUsers = {
                            REFERRED_ID: (_d = (_c = getUser === null || getUser === void 0 ? void 0 : getUser.raw) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.REFERRED_ID
                        };
                        yield (0, club_user_repository_1.updateUser)(whereUser, updateUsers);
                    }
                    return getUser;
                }
                else if ((getUserClub === null || getUserClub === void 0 ? void 0 : getUserClub.TYPE) === "Player") {
                    // Remove Player
                    // update : owner
                    const getUser = yield (0, club_user_repository_1.updateUser)(query, data);
                    return getUser;
                }
            }
            else {
                const getUser = yield (0, club_user_repository_1.updateUser)(query, data);
                return getUser;
            }
        }
        catch (error) {
            console.log(`Delete Error :::: `, error);
            throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, (_e = error === null || error === void 0 ? void 0 : error.message) !== null && _e !== void 0 ? _e : "Club Service is not reachable.");
        }
    });
}
exports.settingClubService = settingClubService;
//# sourceMappingURL=setting.service.js.map