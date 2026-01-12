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
exports.searchUserClub = exports.joinClub = exports.listInvitePlayerController = exports.memberClubController = void 0;
const encrypt_1 = require("src/common/encrypt");
const invited_service_1 = require("../service/invited.service");
const secretKey = 'SM20zD0thg8T5Gz3scOSQ2W4r6r7GJqR';
function memberClubController(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token } = req.body;
            const { clubId, userClubId, type } = req.query;
            const memberList = yield (0, invited_service_1.memberClubService)({ clubId, userClubId, type: !!type ? type : "", USER_ID: token === null || token === void 0 ? void 0 : token.ID });
            // return res.json({ status: true, list, message: "User Club successfully" });
            return res.send(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: true, memberList, message: "Member List in Club" }), secretKey));
        }
        catch (error) {
            return res.json(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "" }), secretKey));
        }
    });
}
exports.memberClubController = memberClubController;
function listInvitePlayerController(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token } = req.body;
            const { clubId } = req.query;
            const invitationList = yield (0, invited_service_1.inviteNewPlayerService)({ clubId, USER_ID: token === null || token === void 0 ? void 0 : token.ID });
            // return res.json({ status: true, invitationList, message: "User Club Invite Player successfully" });
            return res.send(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: true, invitationList, message: "Invitation List in Club" }), secretKey));
        }
        catch (error) {
            return res.json(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "" }), secretKey));
        }
    });
}
exports.listInvitePlayerController = listInvitePlayerController;
function joinClub(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { public_key, content, token } = req.body;
            let decryptBody = yield (0, encrypt_1.decrypt)({ public_key, content }, secretKey);
            const { userId } = req.query;
            const { clubId, isJoin } = JSON.parse(decryptBody);
            let invitedClub = yield (0, invited_service_1.joinClubService)({
                REQUESTED_USER_ID: token === null || token === void 0 ? void 0 : token.ID, clubId: clubId,
                USER_ID: userId,
                isJoin
            });
            return res.send(yield (0, encrypt_1.encrypt)(JSON.stringify({
                status: true, invitedClub,
                message: isJoin ? "Join Invited Club" : "Remove Requested User"
            }), secretKey));
        }
        catch (error) {
            return res.json(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "" }), secretKey));
        }
    });
}
exports.joinClub = joinClub;
function searchUserClub(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { public_key, content, token } = req.body;
            const { name_id, clubId } = req.query;
            let { message, status, searchUserInClub } = yield (0, invited_service_1.searchInvitedClubService)({
                REQUESTED_USER_ID: token === null || token === void 0 ? void 0 : token.ID, clubId: clubId,
                name_id
            });
            if (!!name_id) {
                return res.send(yield (0, encrypt_1.encrypt)(JSON.stringify({
                    status,
                    searchUserInClub,
                    message,
                }), secretKey));
            }
            else {
                return res.send(yield (0, encrypt_1.encrypt)(JSON.stringify({
                    status,
                    searchUserInClub,
                    message
                }), secretKey));
            }
        }
        catch (error) {
            return res.json(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "" }), secretKey));
        }
    });
}
exports.searchUserClub = searchUserClub;
//# sourceMappingURL=invited.controller.js.map