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
exports.requestedListClub = exports.acceptDeclineRequestClub = exports.requestedClub = exports.joinClub = void 0;
const encrypt_1 = require("src/common/encrypt");
const request_club_service_1 = require("../service/request-club.service");
const secretKey = 'SM20zD0thg8T5Gz3scOSQ2W4r6r7GJqR';
function joinClub(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token } = req.body;
            const { id } = req.query;
            let joinRequestClub = yield (0, request_club_service_1.joinClubService)({
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
            let requestedClubList = yield (0, request_club_service_1.requestedUserClubService)({
                USER_ID: token === null || token === void 0 ? void 0 : token.ID
            });
            return res.send(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: true, requestedClubList, message: "Requested Club" }), secretKey));
        }
        catch (error) {
            return res.json(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "" }), secretKey));
        }
    });
}
exports.requestedClub = requestedClub;
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
            let acceptDeclineRequest = yield (0, request_club_service_1.acceptDeclineUserClubService)(reqBody);
            return res.send(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: true, message: acceptDeclineRequest === null || acceptDeclineRequest === void 0 ? void 0 : acceptDeclineRequest.message }), secretKey));
        }
        catch (error) {
            return res.json(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "" }), secretKey));
        }
    });
}
exports.acceptDeclineRequestClub = acceptDeclineRequestClub;
function requestedListClub(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token } = req.body;
            const { clubId } = req.query;
            // You send request
            let requestedClubList = yield (0, request_club_service_1.requestedListUserService)({
                USER_ID: token === null || token === void 0 ? void 0 : token.ID,
                CLUB_ID: clubId
            });
            return res.send(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: true, requestedClubList, message: "Requested Club" }), secretKey));
        }
        catch (error) {
            return res.json(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "" }), secretKey));
        }
    });
}
exports.requestedListClub = requestedListClub;
//# sourceMappingURL=request-club.controller.js.map