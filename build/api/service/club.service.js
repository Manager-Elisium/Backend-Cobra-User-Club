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
exports.acceptDeclineUserClubService = exports.invitedUserClubService = exports.requestedUserClubService = exports.joinClubService = exports.searchUserClubService = exports.listUserClubService = exports.updateNoticeClubService = exports.updateClubService = exports.createClubService = void 0;
const standard_error_1 = __importDefault(require("src/common/standard-error"));
const error_type_1 = require("src/common/error-type");
const club_repository_1 = require("src/repository/club.repository");
const club_user_repository_1 = require("src/repository/club-user.repository");
const club_request_repository_1 = require("src/repository/club-request.repository");
const club_entity_1 = require("src/domain/club.entity");
const typeorm_1 = require("typeorm");
const club_user_entity_1 = require("src/domain/club-user.entity");
const request_repository_1 = require("src/repository/request.repository");
function createClubService(data) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { NAME } = data;
            const query = {
                where: {
                    NAME
                }
            };
            const isPresent = yield (0, club_repository_1.countClub)(query);
            if (isPresent) {
                throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, "Club Name is exists.");
            }
            const club = new club_entity_1.Club();
            club.NAME = data.NAME;
            club.AVATAR = data.AVATAR;
            club.COUNTRY_CODE = data.COUNTRY_CODE;
            club.USER_ID = data.USER_ID;
            const create = yield club.save();
            if (!create) {
                throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, "Club is not created.");
            }
            const setData = {
                USER_ID: data === null || data === void 0 ? void 0 : data.USER_ID,
                TYPE: 'Owner',
                CLUB_ID: create === null || create === void 0 ? void 0 : create.CLUB_ID,
                CHIP: 0
            };
            const createUser = yield (0, club_user_repository_1.createUserClub)(setData);
            if (!createUser) {
                yield (0, club_repository_1.deleteClub)(create === null || create === void 0 ? void 0 : create.CLUB_ID);
                throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, "Club is not created.");
            }
            const setCreateData = {
                USER_ID: data === null || data === void 0 ? void 0 : data.USER_ID,
                TYPE: 'Player',
                CLUB_ID: create === null || create === void 0 ? void 0 : create.CLUB_ID,
                CHIP: 0,
                REFERRED_ID: createUser === null || createUser === void 0 ? void 0 : createUser.ID
            };
            const createPlayer = yield (0, club_user_repository_1.createUserClub)(setCreateData);
            if (!createPlayer) {
                yield (0, club_repository_1.deleteClub)(create === null || create === void 0 ? void 0 : create.CLUB_ID);
                throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, "Club is not created.");
            }
            create === null || create === void 0 ? true : delete create.NOTICE_NAME, delete create.NOTICE_DESCRIPTION;
            const getClub = yield (0, club_user_repository_1.getUserDetailClub)({
                where: { ID: createUser.ID, CLUB_ID: create.CLUB_ID, IS_DELETE: false },
                relations: ['CLUB_ID']
            });
            return getClub;
        }
        catch (error) {
            throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Club is not created.");
        }
    });
}
exports.createClubService = createClubService;
function updateClubService(data) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { NAME, AVATAR } = data;
            const query = {
                where: {
                    NAME,
                    CLUB_ID: (0, typeorm_1.Not)(data === null || data === void 0 ? void 0 : data.clubId)
                }
            };
            const isPresent = yield (0, club_repository_1.countClub)(query);
            if (isPresent) {
                throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, "Club Name is exists.");
            }
            const update = yield (0, club_repository_1.updateAndReturnById)(data === null || data === void 0 ? void 0 : data.clubId, { NAME, AVATAR });
            if (!update) {
                throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, "Club is not created.");
            }
            return (_a = update === null || update === void 0 ? void 0 : update.raw) === null || _a === void 0 ? void 0 : _a[0];
        }
        catch (error) {
            throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, (_b = error === null || error === void 0 ? void 0 : error.message) !== null && _b !== void 0 ? _b : "Club is not created.");
        }
    });
}
exports.updateClubService = updateClubService;
function updateNoticeClubService(data) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { NOTICE_NAME, NOTICE_DESCRIPTION } = data;
            const update = yield (0, club_repository_1.updateAndReturnById)(data === null || data === void 0 ? void 0 : data.clubId, { NOTICE_NAME, NOTICE_DESCRIPTION });
            if (!update) {
                throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, "Club is not updated.");
            }
            return (_a = update === null || update === void 0 ? void 0 : update.raw) === null || _a === void 0 ? void 0 : _a[0];
        }
        catch (error) {
            throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, (_b = error === null || error === void 0 ? void 0 : error.message) !== null && _b !== void 0 ? _b : "Club is not updated.");
        }
    });
}
exports.updateNoticeClubService = updateNoticeClubService;
function listUserClubService(data) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = {
                USER_ID: data.USER_ID,
                TYPE: "Player"
            };
            const getClubs = yield Promise.all([
                yield (0, club_user_repository_1.listUserClub)(query),
                yield (0, request_repository_1.requestedCount)(query),
                yield (0, club_request_repository_1.invitationsCount)(query)
            ]);
            console.log(`getClubs :::: `, getClubs === null || getClubs === void 0 ? void 0 : getClubs[0]);
            const ownerClub = (_b = (_a = (getClubs)) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.filter((fData) => (fData === null || fData === void 0 ? void 0 : fData.user_id) === (data === null || data === void 0 ? void 0 : data.USER_ID) && (fData === null || fData === void 0 ? void 0 : fData.user_type) !== "Player");
            const agentClub = (_d = (_c = (getClubs)) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.filter((fData) => (fData === null || fData === void 0 ? void 0 : fData.user_id) !== (data === null || data === void 0 ? void 0 : data.USER_ID) && (fData === null || fData === void 0 ? void 0 : fData.user_type) === "Agent");
            const playerClub = (_f = (_e = (getClubs)) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.filter((fData) => (fData === null || fData === void 0 ? void 0 : fData.user_id) !== (data === null || data === void 0 ? void 0 : data.USER_ID) && (fData === null || fData === void 0 ? void 0 : fData.user_type) === "Player");
            console.log(`Owner Club `, ownerClub);
            console.log(`Player Club `, playerClub);
            return { clubList: (_g = [...(ownerClub), ...(agentClub), ...(playerClub)]) !== null && _g !== void 0 ? _g : [], countRequested: (_j = (_h = (getClubs)) === null || _h === void 0 ? void 0 : _h[1]) !== null && _j !== void 0 ? _j : 0, countInvitations: (_l = (_k = (getClubs)) === null || _k === void 0 ? void 0 : _k[2]) !== null && _l !== void 0 ? _l : 0 };
        }
        catch (error) {
            throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, (_m = error === null || error === void 0 ? void 0 : error.message) !== null && _m !== void 0 ? _m : "Club List is not found.");
        }
    });
}
exports.listUserClubService = listUserClubService;
function searchUserClubService(data) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(`Data ::: `, data);
            const query = {
                USER_ID: data.USER_ID
            };
            const searchClub = yield (0, club_user_repository_1.playerUserClub)(query);
            console.log(`searchClub ::: `, searchClub);
            const listClubId = (_a = searchClub === null || searchClub === void 0 ? void 0 : searchClub.map((data) => data === null || data === void 0 ? void 0 : data.club_id)) !== null && _a !== void 0 ? _a : [];
            const getQuery = {
                listClubId,
                name: data === null || data === void 0 ? void 0 : data.name,
                id: data === null || data === void 0 ? void 0 : data.id
            };
            const getList = yield (0, club_repository_1.getClub)(getQuery);
            console.log(`getList dd ::::: `, getList === null || getList === void 0 ? void 0 : getList.filter((fData) => (fData === null || fData === void 0 ? void 0 : fData.USER_ID) !== (data === null || data === void 0 ? void 0 : data.USER_ID)));
            return (_b = getList === null || getList === void 0 ? void 0 : getList.filter((fData) => !listClubId.includes(fData === null || fData === void 0 ? void 0 : fData.CLUB_ID) && (fData === null || fData === void 0 ? void 0 : fData.USER_ID) !== (data === null || data === void 0 ? void 0 : data.USER_ID))) !== null && _b !== void 0 ? _b : [];
        }
        catch (error) {
            throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, (_c = error === null || error === void 0 ? void 0 : error.message) !== null && _c !== void 0 ? _c : "Club List is not found.");
        }
    });
}
exports.searchUserClubService = searchUserClubService;
function joinClubService(data) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = {
                where: {
                    INVITED_USER_ID: data.USER_ID,
                    INVITED: { CLUB_ID: data.id } // Request CLub
                }
            };
            const isPresentClubRequest = yield (0, club_request_repository_1.countRequestClub)(query);
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
                INVITED_USER_ID: data.USER_ID,
                INVITED: data.id,
                REQUESTED_USER_ID: getClub === null || getClub === void 0 ? void 0 : getClub.USER_ID,
                REQUESTED_USER_CLUB_ID: getClub === null || getClub === void 0 ? void 0 : getClub.ID // Accept - Decline
            };
            const sendRequest = yield (0, club_request_repository_1.createRequestClub)(insertQuery);
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
            const requestQuery = {
                REQUESTED_USER_ID: data.INVITED_USER_ID
            };
            const reqquestedUserClub = yield (0, club_request_repository_1.requestedClubUser)(requestQuery);
            return reqquestedUserClub;
        }
        catch (error) {
            throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Request Join Club -- Error.");
        }
    });
}
exports.requestedUserClubService = requestedUserClubService;
function invitedUserClubService(data) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const requestQuery = {
                REQUESTED_USER_ID: data.REQUESTED_USER_ID
            };
            const reqquestedUserClub = yield (0, club_request_repository_1.invitedClubUser)(requestQuery);
            return reqquestedUserClub;
        }
        catch (error) {
            throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Request Join Club -- Error.");
        }
    });
}
exports.invitedUserClubService = invitedUserClubService;
function acceptDeclineUserClubService(data) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deleteRequest = yield (0, club_request_repository_1.deleteClubRequest)(data === null || data === void 0 ? void 0 : data.REQUEST_ID);
            if (data.isAccept) {
                let referredId = (_b = (_a = deleteRequest === null || deleteRequest === void 0 ? void 0 : deleteRequest.raw) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.REQUESTED_USER_CLUB_ID;
                if (!referredId) {
                    const getQueryData = {
                        where: {
                            CLUB_ID: (_d = (_c = deleteRequest === null || deleteRequest === void 0 ? void 0 : deleteRequest.raw) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.INVITED,
                            USER_ID: (_f = (_e = deleteRequest === null || deleteRequest === void 0 ? void 0 : deleteRequest.raw) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.REQUESTED_USER_ID,
                        }
                    };
                    const getClubUser = yield (0, club_user_repository_1.getUserType)(getQueryData);
                    referredId = getClubUser === null || getClubUser === void 0 ? void 0 : getClubUser.ID;
                }
                const jointClub = {
                    USER_ID: (_h = (_g = deleteRequest === null || deleteRequest === void 0 ? void 0 : deleteRequest.raw) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.INVITED_USER_ID,
                    CLUB_ID: (_k = (_j = deleteRequest === null || deleteRequest === void 0 ? void 0 : deleteRequest.raw) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.INVITED,
                    REFERRED_ID: referredId !== null && referredId !== void 0 ? referredId : null
                };
                yield (0, club_user_repository_1.createUserClub)(jointClub);
            }
            return { message: data.isAccept ? "Join Successfully Club." : "Decline Join Club." };
        }
        catch (error) {
            throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, (_l = error === null || error === void 0 ? void 0 : error.message) !== null && _l !== void 0 ? _l : "Accept - Decline User Service.");
        }
    });
}
exports.acceptDeclineUserClubService = acceptDeclineUserClubService;
// Function to remove duplicates based on user_id and club_id
const removeDuplicates = (entries) => {
    const seen = new Set();
    return entries.filter(entry => {
        const key = `${entry.user_id}_${entry.club_id}`;
        console.log(`key :::: `, key);
        if (seen.has(key)) {
            return false;
        }
        else {
            seen.add(key);
            return true;
        }
    });
};
//# sourceMappingURL=club.service.js.map