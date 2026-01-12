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
exports.requestedListUserService = exports.acceptDeclineUserClubService = exports.requestedUserClubService = exports.joinClubService = void 0;
const standard_error_1 = __importDefault(require("src/common/standard-error"));
const error_type_1 = require("src/common/error-type");
const club_user_repository_1 = require("src/repository/club-user.repository");
const club_user_entity_1 = require("src/domain/club-user.entity");
const request_repository_1 = require("src/repository/request.repository");
function joinClubService(data) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // REQUEST_FROM_USER_ID: string;
            // REQUEST_TO_USER_CLUB_ID: string;
            // REQUEST_TO_USER_ID: string;
            // REQUEST_TO_CLUB_ID: Club;
            const query = {
                where: {
                    REQUEST_FROM_USER_ID: data.USER_ID,
                    REQUEST_TO_CLUB_ID: { CLUB_ID: data.id } // Request CLub
                }
            };
            const isPresentClubRequest = yield (0, request_repository_1.countRequestClub)(query);
            if (isPresentClubRequest) {
                throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, "Already Send Request This Club.");
            }
            const getQuery = {
                where: {
                    CLUB_ID: data.id,
                    TYPE: club_user_entity_1.UserType.OWNER
                }
            };
            const getClub = yield (0, club_user_repository_1.getUserType)(getQuery);
            const insertQuery = {
                REQUEST_FROM_USER_ID: data.USER_ID,
                REQUEST_TO_CLUB_ID: data.id,
                REQUEST_TO_USER_ID: getClub === null || getClub === void 0 ? void 0 : getClub.USER_ID,
                REQUEST_TO_USER_CLUB_ID: getClub === null || getClub === void 0 ? void 0 : getClub.ID // Accept - Decline
            };
            const sendRequest = yield (0, request_repository_1.createRequestClub)(insertQuery);
            return sendRequest;
        }
        catch (error) {
            throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Request Join Club -- Error.");
        }
    });
}
exports.joinClubService = joinClubService;
function requestedUserClubService(data) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = {
                USER_ID: data.USER_ID
            };
            const requestedUserClub = yield (0, request_repository_1.requestedClubUser)(query);
            return requestedUserClub;
        }
        catch (error) {
            throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Request Join Club -- Error.");
        }
    });
}
exports.requestedUserClubService = requestedUserClubService;
function acceptDeclineUserClubService(data) {
    var _a, _b, _c, _d, _e, _f, _g;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deleteRequest = yield (0, request_repository_1.deleteClubRequest)(data === null || data === void 0 ? void 0 : data.REQUEST_ID);
            if (data.isAccept) {
                const jointClub = {
                    USER_ID: (_b = (_a = deleteRequest === null || deleteRequest === void 0 ? void 0 : deleteRequest.raw) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.REQUEST_FROM_USER_ID,
                    CLUB_ID: (_d = (_c = deleteRequest === null || deleteRequest === void 0 ? void 0 : deleteRequest.raw) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.REQUEST_TO_CLUB_ID,
                    REFERRED_ID: (_f = (_e = deleteRequest === null || deleteRequest === void 0 ? void 0 : deleteRequest.raw) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.REQUEST_TO_USER_CLUB_ID
                };
                yield (0, club_user_repository_1.createUserClub)(jointClub);
            }
            return { message: data.isAccept ? "Join Successfully Club." : "Decline Join Club." };
        }
        catch (error) {
            throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, (_g = error === null || error === void 0 ? void 0 : error.message) !== null && _g !== void 0 ? _g : "Accept - Decline User Service.");
        }
    });
}
exports.acceptDeclineUserClubService = acceptDeclineUserClubService;
function requestedListUserService(data) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = {
                CLUB_ID: data.CLUB_ID
            };
            const requestedUserClub = yield (0, request_repository_1.requestedUserListClub)(query);
            return requestedUserClub;
        }
        catch (error) {
            throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Request Join Club -- Error.");
        }
    });
}
exports.requestedListUserService = requestedListUserService;
//# sourceMappingURL=request-club.service.js.map