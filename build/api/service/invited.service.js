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
exports.searchInvitedClubService = exports.joinClubService = exports.inviteNewPlayerService = exports.memberClubService = void 0;
const axios_1 = __importDefault(require("axios"));
const error_type_1 = require("src/common/error-type");
const standard_error_1 = __importDefault(require("src/common/standard-error"));
const club_user_entity_1 = require("src/domain/club-user.entity");
const club_request_repository_1 = require("src/repository/club-request.repository");
const club_user_repository_1 = require("src/repository/club-user.repository");
const club_repository_1 = require("src/repository/club.repository");
const typeorm_1 = require("typeorm");
function memberClubService(data) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let getClubType;
            if (!!(data === null || data === void 0 ? void 0 : data.userClubId)) {
                getClubType = yield (0, club_user_repository_1.getUserType)({
                    where: {
                        CLUB_ID: data === null || data === void 0 ? void 0 : data.clubId,
                        ID: data === null || data === void 0 ? void 0 : data.userClubId,
                        IS_DELETE: false,
                    },
                });
            }
            else {
                getClubType = yield (0, club_user_repository_1.getUserType)({
                    where: {
                        CLUB_ID: data === null || data === void 0 ? void 0 : data.clubId,
                        USER_ID: data === null || data === void 0 ? void 0 : data.USER_ID,
                        IS_DELETE: false,
                    },
                });
            }
            // if (getClubType?.length > 0) {
            const getType = getClubType;
            if ((getType === null || getType === void 0 ? void 0 : getType.TYPE) === "Owner") {
                const query = {
                    where: {
                        CLUB_ID: data === null || data === void 0 ? void 0 : data.clubId,
                        IS_DELETE: false,
                    },
                };
                const getUserDetail = yield (0, club_user_repository_1.getUserDetailClub)(query);
                const ownerData = getUserDetail === null || getUserDetail === void 0 ? void 0 : getUserDetail.find((data) => {
                    return (data === null || data === void 0 ? void 0 : data.USER_ID) === (getType === null || getType === void 0 ? void 0 : getType.USER_ID) && (data === null || data === void 0 ? void 0 : data.TYPE) === "Owner";
                });
                const ownerPlayerData = getUserDetail === null || getUserDetail === void 0 ? void 0 : getUserDetail.find((data) => (data === null || data === void 0 ? void 0 : data.USER_ID) === (getType === null || getType === void 0 ? void 0 : getType.USER_ID) && (data === null || data === void 0 ? void 0 : data.TYPE) === "Player");
                const playerData = getUserDetail === null || getUserDetail === void 0 ? void 0 : getUserDetail.filter((data) => (data === null || data === void 0 ? void 0 : data.USER_ID) !== (getType === null || getType === void 0 ? void 0 : getType.USER_ID));
                const getUser = [
                    Object.assign(Object.assign({}, ownerData), { CHIP: ownerPlayerData === null || ownerPlayerData === void 0 ? void 0 : ownerPlayerData.CHIP, PLAYER_ID: ownerPlayerData === null || ownerPlayerData === void 0 ? void 0 : ownerPlayerData.ID }),
                    ...playerData,
                ];
                const getUserList = (_a = [ownerData, ...playerData]) === null || _a === void 0 ? void 0 : _a.map((data) => data === null || data === void 0 ? void 0 : data.USER_ID);
                // const getUserList = getUser?.filter((data) => data?.USER_ID === getType?.USER_ID && getType?.TYPE !== UserType.PLAYER);
                let userInfo = (yield axios_1.default.post(`http://192.168.1.46:3003/friend/list-user-details`, {
                    userId: getUserList.toString(),
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }));
                if ((data === null || data === void 0 ? void 0 : data.type) === "Agent") {
                    return (_b = getUser === null || getUser === void 0 ? void 0 : getUser.filter((data) => data.TYPE === "Agent")) === null || _b === void 0 ? void 0 : _b.map((data) => {
                        var _a, _b;
                        let getData = (_b = (_a = userInfo === null || userInfo === void 0 ? void 0 : userInfo.data) === null || _a === void 0 ? void 0 : _a.users) === null || _b === void 0 ? void 0 : _b.find((inner) => inner.ID === data.USER_ID);
                        // let isOwner = getUserList?.includes(data?.USER_ID);
                        return Object.assign(Object.assign({}, data), { USER_NAME: getData === null || getData === void 0 ? void 0 : getData.USER_NAME, AVATAR: getData === null || getData === void 0 ? void 0 : getData.AVATAR, FB_PROFILE: getData === null || getData === void 0 ? void 0 : getData.FB_PROFILE, COUNTRY_CODE: getData === null || getData === void 0 ? void 0 : getData.COUNTRY_CODE, FRAME: getData === null || getData === void 0 ? void 0 : getData.FRAME, ONLINE: getData === null || getData === void 0 ? void 0 : getData.ONLINE, SOCKET_ID: getData === null || getData === void 0 ? void 0 : getData.SOCKET_ID, TYPE: data === null || data === void 0 ? void 0 : data.TYPE });
                    });
                }
                else if ((data === null || data === void 0 ? void 0 : data.type) === "Player") {
                    return (_c = getUser === null || getUser === void 0 ? void 0 : getUser.filter((data) => data.TYPE === "Player")) === null || _c === void 0 ? void 0 : _c.map((data) => {
                        var _a, _b;
                        let getData = (_b = (_a = userInfo === null || userInfo === void 0 ? void 0 : userInfo.data) === null || _a === void 0 ? void 0 : _a.users) === null || _b === void 0 ? void 0 : _b.find((inner) => inner.ID === data.USER_ID);
                        // let isOwner = getUserList?.includes(data.USER_ID);
                        return Object.assign(Object.assign({}, data), { USER_NAME: getData === null || getData === void 0 ? void 0 : getData.USER_NAME, AVATAR: getData === null || getData === void 0 ? void 0 : getData.AVATAR, FB_PROFILE: getData === null || getData === void 0 ? void 0 : getData.FB_PROFILE, COUNTRY_CODE: getData === null || getData === void 0 ? void 0 : getData.COUNTRY_CODE, FRAME: getData === null || getData === void 0 ? void 0 : getData.FRAME, ONLINE: getData === null || getData === void 0 ? void 0 : getData.ONLINE, SOCKET_ID: getData === null || getData === void 0 ? void 0 : getData.SOCKET_ID, TYPE: data === null || data === void 0 ? void 0 : data.TYPE });
                    });
                }
                else {
                    return getUser === null || getUser === void 0 ? void 0 : getUser.map((data) => {
                        var _a, _b;
                        let getData = (_b = (_a = userInfo === null || userInfo === void 0 ? void 0 : userInfo.data) === null || _a === void 0 ? void 0 : _a.users) === null || _b === void 0 ? void 0 : _b.find((inner) => inner.ID === data.USER_ID);
                        // let isOwner = getUserList?.includes(data.USER_ID);
                        return Object.assign(Object.assign({}, data), { USER_NAME: getData === null || getData === void 0 ? void 0 : getData.USER_NAME, AVATAR: getData === null || getData === void 0 ? void 0 : getData.AVATAR, FB_PROFILE: getData === null || getData === void 0 ? void 0 : getData.FB_PROFILE, COUNTRY_CODE: getData === null || getData === void 0 ? void 0 : getData.COUNTRY_CODE, FRAME: getData === null || getData === void 0 ? void 0 : getData.FRAME, ONLINE: getData === null || getData === void 0 ? void 0 : getData.ONLINE, SOCKET_ID: getData === null || getData === void 0 ? void 0 : getData.SOCKET_ID, TYPE: data === null || data === void 0 ? void 0 : data.TYPE });
                    });
                }
            }
            else if ((getType === null || getType === void 0 ? void 0 : getType.TYPE) === "Agent") {
                const query = {
                    where: {
                        CLUB_ID: data === null || data === void 0 ? void 0 : data.clubId,
                        REFERRED_ID: { ID: getClubType === null || getClubType === void 0 ? void 0 : getClubType.ID },
                        TYPE: (0, typeorm_1.In)([club_user_entity_1.UserType.AGENT, club_user_entity_1.UserType.PLAYER]),
                        IS_DELETE: false,
                    },
                };
                const getAgentUser = yield (0, club_user_repository_1.getUserDetailClub)(query);
                const getUser = [...getAgentUser, getClubType];
                const getUserList = [
                    ...getUser === null || getUser === void 0 ? void 0 : getUser.map((data) => data.USER_ID),
                    getType === null || getType === void 0 ? void 0 : getType.USER_ID,
                ];
                let userInfo = (yield axios_1.default.post(`http://192.168.1.46:3003/friend/list-user-details`, {
                    userId: getUserList.toString(),
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }));
                return [
                    ...getUser === null || getUser === void 0 ? void 0 : getUser.map((data) => {
                        var _a, _b;
                        let getData = (_b = (_a = userInfo === null || userInfo === void 0 ? void 0 : userInfo.data) === null || _a === void 0 ? void 0 : _a.users) === null || _b === void 0 ? void 0 : _b.find((inner) => inner.ID === data.USER_ID);
                        let isOwner = getUserList === null || getUserList === void 0 ? void 0 : getUserList.includes(data.USER_ID);
                        return Object.assign(Object.assign({}, data), { USER_NAME: getData === null || getData === void 0 ? void 0 : getData.USER_NAME, AVATAR: getData === null || getData === void 0 ? void 0 : getData.AVATAR, FB_PROFILE: getData === null || getData === void 0 ? void 0 : getData.FB_PROFILE, COUNTRY_CODE: getData === null || getData === void 0 ? void 0 : getData.COUNTRY_CODE, FRAME: getData === null || getData === void 0 ? void 0 : getData.FRAME, ONLINE: getData === null || getData === void 0 ? void 0 : getData.ONLINE, SOCKET_ID: getData === null || getData === void 0 ? void 0 : getData.SOCKET_ID, TYPE: data === null || data === void 0 ? void 0 : data.TYPE });
                    }),
                ];
            }
            else {
                const query = {
                    where: {
                        CLUB_ID: data === null || data === void 0 ? void 0 : data.clubId,
                        USER_ID: data.USER_ID,
                        TYPE: (0, typeorm_1.In)([club_user_entity_1.UserType.PLAYER]),
                        IS_DELETE: false,
                    },
                };
                const getUser = yield (0, club_user_repository_1.getUserDetailClub)(query);
                const getUserList = getUser === null || getUser === void 0 ? void 0 : getUser.map((data) => data.USER_ID);
                let userInfo = (yield axios_1.default.post(`http://192.168.1.46:3003/friend/list-user-details`, {
                    userId: getUserList.toString(),
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }));
                return getUser === null || getUser === void 0 ? void 0 : getUser.map((data) => {
                    var _a, _b;
                    let getData = (_b = (_a = userInfo === null || userInfo === void 0 ? void 0 : userInfo.data) === null || _a === void 0 ? void 0 : _a.users) === null || _b === void 0 ? void 0 : _b.find((inner) => inner.ID === data.USER_ID);
                    let isOwner = getUserList === null || getUserList === void 0 ? void 0 : getUserList.includes(data.USER_ID);
                    return Object.assign(Object.assign({}, data), { USER_NAME: getData === null || getData === void 0 ? void 0 : getData.USER_NAME, AVATAR: getData === null || getData === void 0 ? void 0 : getData.AVATAR, FB_PROFILE: getData === null || getData === void 0 ? void 0 : getData.FB_PROFILE, COUNTRY_CODE: getData === null || getData === void 0 ? void 0 : getData.COUNTRY_CODE, FRAME: getData === null || getData === void 0 ? void 0 : getData.FRAME, ONLINE: getData === null || getData === void 0 ? void 0 : getData.ONLINE, SOCKET_ID: getData === null || getData === void 0 ? void 0 : getData.SOCKET_ID, TYPE: data === null || data === void 0 ? void 0 : data.TYPE });
                });
            }
            // }
            // else {
            //     return getClubType;
            // }
        }
        catch (error) {
            throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, (_d = error === null || error === void 0 ? void 0 : error.message) !== null && _d !== void 0 ? _d : "Club Member List is not found.");
        }
    });
}
exports.memberClubService = memberClubService;
function inviteNewPlayerService(data) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = {
                where: {
                    CLUB_ID: data === null || data === void 0 ? void 0 : data.clubId,
                    IS_DELETE: false,
                },
            };
            let invitedUser = yield (0, club_request_repository_1.clubUser)({
                where: {
                    REQUESTED_USER_ID: data === null || data === void 0 ? void 0 : data.USER_ID,
                    INVITED: { CLUB_ID: data === null || data === void 0 ? void 0 : data.clubId },
                },
            });
            const getUser = yield (0, club_user_repository_1.getUserDetailClub)(query);
            let friendList = (yield axios_1.default.get(`http://192.168.1.46:3003/friend/my-friend-list/${data === null || data === void 0 ? void 0 : data.USER_ID}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            }));
            const currentClubUser = getUser === null || getUser === void 0 ? void 0 : getUser.map((data) => data.USER_ID);
            const currentFriend = (_b = (_a = friendList === null || friendList === void 0 ? void 0 : friendList.data) === null || _a === void 0 ? void 0 : _a.friends) === null || _b === void 0 ? void 0 : _b.filter((data) => !currentClubUser.includes(data.ID));
            const currentInvited = invitedUser === null || invitedUser === void 0 ? void 0 : invitedUser.map((data) => data === null || data === void 0 ? void 0 : data.INVITED_USER_ID);
            return currentFriend === null || currentFriend === void 0 ? void 0 : currentFriend.map((data) => {
                const isSendRequest = currentInvited === null || currentInvited === void 0 ? void 0 : currentInvited.includes(data === null || data === void 0 ? void 0 : data.ID);
                return Object.assign(Object.assign({}, data), { IS_SEND_REQUEST: isSendRequest });
            });
        }
        catch (error) {
            throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, (_c = error === null || error === void 0 ? void 0 : error.message) !== null && _c !== void 0 ? _c : "Club Member List is not found.");
        }
    });
}
exports.inviteNewPlayerService = inviteNewPlayerService;
function joinClubService(data) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (data.isJoin) {
                // Request
                // INVITED: Club;
                // Request
                // INVITED_USER_ID: string;
                // Club Owner OR Request Agent
                // Accept - Decline
                // REQUESTED_USER_CLUB_ID: string;
                // Club Owner OR Request Agent
                // Accept - Decline
                // REQUESTED_USER_ID: string;
                console.log(`Request Data :::: `, data);
                const query = {
                    where: {
                        INVITED_USER_ID: data.USER_ID,
                        INVITED: { CLUB_ID: data.clubId }, // Request CLub
                    },
                };
                const isPresentClubRequest = yield (0, club_request_repository_1.countRequestClub)(query);
                console.log(`isPresentClubRequest :::: `, isPresentClubRequest);
                if (isPresentClubRequest) {
                    throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, "Already Send Request This Club.");
                }
                const getQuery = {
                    where: {
                        CLUB_ID: data.clubId,
                    },
                };
                const getClub = yield (0, club_repository_1.getOneClub)(getQuery);
                console.log(`getClub :::: `, getClub);
                const isAgent = (getClub === null || getClub === void 0 ? void 0 : getClub.USER_ID) != (data === null || data === void 0 ? void 0 : data.REQUESTED_USER_ID);
                console.log(`isAgent :::: `, isAgent);
                const getQueryData = {
                    where: {
                        CLUB_ID: data.clubId,
                        USER_ID: data === null || data === void 0 ? void 0 : data.USER_ID,
                    },
                };
                const getClubUser = yield (0, club_user_repository_1.getUserType)(getQueryData);
                console.log(`getClubUser :::: `, getClubUser);
                const insertQuery = {
                    INVITED_USER_ID: data.USER_ID,
                    INVITED: data.clubId,
                    REQUESTED_USER_ID: data === null || data === void 0 ? void 0 : data.REQUESTED_USER_ID,
                    REQUESTED_USER_CLUB_ID: getClubUser === null || getClubUser === void 0 ? void 0 : getClubUser.ID,
                    IS_AGENT: isAgent,
                };
                const sendRequest = yield (0, club_request_repository_1.createRequestClub)(insertQuery);
                return sendRequest;
            }
            else {
                const query = {
                    INVITED_USER_ID: data.USER_ID,
                    INVITED: data.clubId, // Request CLub
                };
                const deleteRequest = yield (0, club_request_repository_1.deleteClubRequestByClub)(query);
                return (_a = deleteRequest === null || deleteRequest === void 0 ? void 0 : deleteRequest.raw) === null || _a === void 0 ? void 0 : _a[0];
            }
        }
        catch (error) {
            throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, (_b = error === null || error === void 0 ? void 0 : error.message) !== null && _b !== void 0 ? _b : "Request Join Club -- Error.");
        }
    });
}
exports.joinClubService = joinClubService;
function searchInvitedClubService(data) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = {
                where: {
                    CLUB_ID: data === null || data === void 0 ? void 0 : data.clubId,
                    USER_ID: (0, typeorm_1.Not)(data === null || data === void 0 ? void 0 : data.REQUESTED_USER_ID),
                    IS_DELETE: false,
                },
            };
            const getCurrentUser = yield (0, club_user_repository_1.getUserDetailClub)(query);
            const getCurrentUserId = getCurrentUser === null || getCurrentUser === void 0 ? void 0 : getCurrentUser.map((data) => data.USER_ID);
            console.log(`getCurrentUserId :::: `, getCurrentUserId);
            let friendList = (yield axios_1.default.post(`http://192.168.1.46:3003/friend/search-invite-club-user`, {
                userId: getCurrentUser === null || getCurrentUser === void 0 ? void 0 : getCurrentUser.map((data) => data.USER_ID),
                name_id: data === null || data === void 0 ? void 0 : data.name_id,
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            }));
            if (getCurrentUserId.includes((_b = (_a = friendList === null || friendList === void 0 ? void 0 : friendList.data) === null || _a === void 0 ? void 0 : _a.users) === null || _b === void 0 ? void 0 : _b.ID)) {
                return { status: false, message: "Player is alreday in club." };
            }
            const getRequestUser = yield (0, club_request_repository_1.clubUser)({
                where: {
                    INVITED_USER_ID: (_d = (_c = friendList === null || friendList === void 0 ? void 0 : friendList.data) === null || _c === void 0 ? void 0 : _c.users) === null || _d === void 0 ? void 0 : _d.ID,
                },
            });
            const IS_SEND_REQUEST = ((_e = getRequestUser === null || getRequestUser === void 0 ? void 0 : getRequestUser[0]) === null || _e === void 0 ? void 0 : _e.INVITED_USER_ID) === ((_g = (_f = friendList === null || friendList === void 0 ? void 0 : friendList.data) === null || _f === void 0 ? void 0 : _f.users) === null || _g === void 0 ? void 0 : _g.ID);
            if (!!((_j = (_h = friendList === null || friendList === void 0 ? void 0 : friendList.data) === null || _h === void 0 ? void 0 : _h.users) === null || _j === void 0 ? void 0 : _j.ID)) {
                return {
                    status: true,
                    searchUserInClub: Object.assign(Object.assign({}, (_k = friendList === null || friendList === void 0 ? void 0 : friendList.data) === null || _k === void 0 ? void 0 : _k.users), { IS_SEND_REQUEST }),
                    message: "Get User",
                };
            }
            else {
                return { status: false, message: "Not Found" };
            }
        }
        catch (error) {
            throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, (_l = error === null || error === void 0 ? void 0 : error.message) !== null && _l !== void 0 ? _l : "Request Join Club -- Error.");
        }
    });
}
exports.searchInvitedClubService = searchInvitedClubService;
//# sourceMappingURL=invited.service.js.map