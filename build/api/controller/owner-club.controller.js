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
exports.acceptDeclineRequestClub = exports.invitedClub = exports.requestedClub = exports.joinClub = exports.searchClub = exports.listClub = exports.updateNoticeClub = exports.updateClub = exports.createClub = void 0;
const encrypt_1 = require("src/common/encrypt");
const club_service_1 = require("../service/club.service");
const secretKey = 'SM20zD0thg8T5Gz3scOSQ2W4r6r7GJqR';
function createClub(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { public_key, content, token } = req.body;
            let decryptBody = yield (0, encrypt_1.decrypt)({ public_key, content }, secretKey);
            const { NAME, AVATAR, COUNTRY_CODE } = JSON.parse(decryptBody);
            let createClub = yield (0, club_service_1.createClubService)({ NAME, AVATAR, COUNTRY_CODE, USER_ID: token === null || token === void 0 ? void 0 : token.ID });
            return res.send(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: true, createClub, message: "Create Club" }), secretKey));
        }
        catch (error) {
            return res.json(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "" }), secretKey));
        }
    });
}
exports.createClub = createClub;
function updateClub(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { public_key, content, token } = req.body;
            const { clubId } = req.query;
            let decryptBody = yield (0, encrypt_1.decrypt)({ public_key, content }, secretKey);
            const { NAME, AVATAR } = JSON.parse(decryptBody);
            let updateClub = yield (0, club_service_1.updateClubService)({ NAME, AVATAR, USER_ID: token === null || token === void 0 ? void 0 : token.ID, clubId });
            return res.send(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: true, updateClub, message: "Update Club" }), secretKey));
        }
        catch (error) {
            return res.json(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "" }), secretKey));
        }
    });
}
exports.updateClub = updateClub;
function updateNoticeClub(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { public_key, content, token } = req.body;
            const { clubId } = req.query;
            let decryptBody = yield (0, encrypt_1.decrypt)({ public_key, content }, secretKey);
            const { NOTICE_NAME, NOTICE_DESCRIPTION } = JSON.parse(decryptBody);
            let updateClub = yield (0, club_service_1.updateNoticeClubService)({ NOTICE_NAME, NOTICE_DESCRIPTION, USER_ID: token === null || token === void 0 ? void 0 : token.ID, clubId });
            return res.send(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: true, updateClub, message: "Update Club" }), secretKey));
        }
        catch (error) {
            return res.json(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "" }), secretKey));
        }
    });
}
exports.updateNoticeClub = updateNoticeClub;
function listClub(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token, } = req.body;
            let { clubList, countInvitations, countRequested } = yield (0, club_service_1.listUserClubService)({ USER_ID: token === null || token === void 0 ? void 0 : token.ID });
            console.log(token === null || token === void 0 ? void 0 : token.ID, " Token");
            return res.send(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: true, clubList, countInvitations, countRequested, message: "List Club" }), secretKey));
        }
        catch (error) {
            return res.json(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "" }), secretKey));
        }
    });
}
exports.listClub = listClub;
function searchClub(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token } = req.body;
            // TODO :: Single Input
            const { name_id } = req.query;
            let listClub = yield (0, club_service_1.searchUserClubService)({
                USER_ID: token === null || token === void 0 ? void 0 : token.ID, name: name_id || "", id: name_id || ""
            });
            return res.send(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: true, listClub, message: "Get Club" }), secretKey));
        }
        catch (error) {
            return res.json(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "" }), secretKey));
        }
    });
}
exports.searchClub = searchClub;
function joinClub(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token } = req.body;
            const { id } = req.query;
            let joinRequestClub = yield (0, club_service_1.joinClubService)({
                USER_ID: token === null || token === void 0 ? void 0 : token.ID, id: id || ""
            });
            return res.send(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: true, joinRequestClub, message: "Request Club" }), secretKey));
        }
        catch (error) {
            return res.json(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "" }), secretKey));
        }
    });
}
exports.joinClub = joinClub;
function requestedClub(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token } = req.body;
            // You send request
            let requestedClubList = yield (0, club_service_1.requestedUserClubService)({
                INVITED_USER_ID: token === null || token === void 0 ? void 0 : token.ID
            });
            return res.send(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: true, requestedClubList, message: "Requested Club" }), secretKey));
        }
        catch (error) {
            return res.json(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "" }), secretKey));
        }
    });
}
exports.requestedClub = requestedClub;
function invitedClub(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token } = req.body;
            // You receive request
            let invitedClubList = yield (0, club_service_1.invitedUserClubService)({
                REQUESTED_USER_ID: token === null || token === void 0 ? void 0 : token.ID
            });
            return res.send(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: true, invitedClubList, message: "Invited Club" }), secretKey));
        }
        catch (error) {
            return res.json(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "" }), secretKey));
        }
    });
}
exports.invitedClub = invitedClub;
function acceptDeclineRequestClub(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token } = req.body;
            const { requestId, isAccept } = req.query;
            const reqBody = {
                USER_ID: token === null || token === void 0 ? void 0 : token.ID,
                REQUEST_ID: requestId,
                isAccept: isAccept === 'true' || isAccept === 'True' ? true : false
            };
            let acceptDeclineRequest = yield (0, club_service_1.acceptDeclineUserClubService)(reqBody);
            return res.send(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: true, message: acceptDeclineRequest === null || acceptDeclineRequest === void 0 ? void 0 : acceptDeclineRequest.message }), secretKey));
        }
        catch (error) {
            return res.json(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "" }), secretKey));
        }
    });
}
exports.acceptDeclineRequestClub = acceptDeclineRequestClub;
//# sourceMappingURL=owner-club.controller.js.map