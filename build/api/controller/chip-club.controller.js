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
exports.subtractChipRequestController = exports.addChipRequestController = exports.chipAcceptDeclineController = exports.chipRequestListController = exports.chipSendRequestController = void 0;
const encrypt_1 = require("src/common/encrypt");
const chip_club_service_1 = require("../service/chip-club.service");
const secretKey = 'SM20zD0thg8T5Gz3scOSQ2W4r6r7GJqR';
function chipSendRequestController(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { public_key, content, token } = req.body;
            let decryptBody = yield (0, encrypt_1.decrypt)({ public_key, content }, secretKey);
            const { clubId } = req.query;
            const body = Object.assign(Object.assign({}, JSON.parse(decryptBody)), { clubId, USER_ID: token === null || token === void 0 ? void 0 : token.ID });
            const chipRequest = yield (0, chip_club_service_1.chipRequestService)(body);
            return res.json(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: true, message: "Chip Send Request Successfully" }), secretKey));
        }
        catch (error) {
            return res.json(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "" }), secretKey));
        }
    });
}
exports.chipSendRequestController = chipSendRequestController;
function chipRequestListController(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { public_key, content, token } = req.body;
            let decryptBody = yield (0, encrypt_1.decrypt)({ public_key, content }, secretKey);
            const { clubId } = req.query;
            const body = Object.assign(Object.assign({}, JSON.parse(decryptBody)), { clubId, USER_ID: token === null || token === void 0 ? void 0 : token.ID });
            const { chipRequestList } = yield (0, chip_club_service_1.chipRequestListService)(body);
            return res.json(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: true, chipRequestList, message: "Chip List Request Successfully" }), secretKey));
        }
        catch (error) {
            return res.json(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "" }), secretKey));
        }
    });
}
exports.chipRequestListController = chipRequestListController;
function chipAcceptDeclineController(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { public_key, content, token } = req.body;
            let decryptBody = yield (0, encrypt_1.decrypt)({ public_key, content }, secretKey);
            const { clubId } = req.query;
            const body = Object.assign(Object.assign({}, JSON.parse(decryptBody)), { clubId, USER_ID: token === null || token === void 0 ? void 0 : token.ID });
            const { status, message } = yield (0, chip_club_service_1.chipAcceptDeclineService)(body);
            if (status) {
                return res.json(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: true, message: "Chip Accept Decline Request Successfully" }), secretKey));
            }
            else {
                return res.json(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: true, message: message }), secretKey));
            }
        }
        catch (error) {
            return res.json(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "" }), secretKey));
        }
    });
}
exports.chipAcceptDeclineController = chipAcceptDeclineController;
function addChipRequestController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { USER_CLUB_ID, CHIP } = req.body;
            const body = {
                USER_CLUB_ID,
                CHIP,
                type: "add"
            };
            const addChip = yield (0, chip_club_service_1.addChipService)(body);
            return res.json({ status: true });
        }
        catch (error) {
            return res.json({ status: false });
        }
    });
}
exports.addChipRequestController = addChipRequestController;
function subtractChipRequestController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { USER_CLUB_ID, CHIP } = req.body;
            const body = {
                USER_CLUB_ID,
                CHIP,
                type: "subtract"
            };
            const subtractChip = yield (0, chip_club_service_1.addChipService)(body);
            return res.json({ status: true });
        }
        catch (error) {
            return res.json({ status: false });
        }
    });
}
exports.subtractChipRequestController = subtractChipRequestController;
//# sourceMappingURL=chip-club.controller.js.map