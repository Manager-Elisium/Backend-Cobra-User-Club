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
exports.adminClubController = void 0;
const encrypt_1 = require("src/common/encrypt");
const admin_club_service_1 = require("../service/admin-club.service");
const secretKey = 'SWS0zf0thg8T5Gz3scOSQ2W4r6r7GJAg';
function adminClubController(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.query;
            const list = yield (0, admin_club_service_1.listClubService)({ userId });
            let encryptedData = (0, encrypt_1.encrypt)(JSON.stringify(list), secretKey);
            const decryptData = yield (0, encrypt_1.decrypt)(yield encryptedData, secretKey);
            console.log("Decrypt Data : ", decryptData);
            return res.json({ status: true, data: yield encryptedData, message: "User Club successfully" });
        }
        catch (error) {
            return res.json({ status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "" });
        }
    });
}
exports.adminClubController = adminClubController;
//# sourceMappingURL=admin-club.controller.js.map