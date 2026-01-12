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
exports.settingClubController = void 0;
const encrypt_1 = require("src/common/encrypt");
const setting_service_1 = require("../service/setting.service");
const secretKey = 'SM20zD0thg8T5Gz3scOSQ2W4r6r7GJqR';
function settingClubController(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { public_key, content, token } = req.body;
            let decryptBody = yield (0, encrypt_1.decrypt)({ public_key, content }, secretKey);
            const { clubId } = req.query;
            const body = Object.assign(Object.assign({}, JSON.parse(decryptBody)), { clubId, USER_ID: token === null || token === void 0 ? void 0 : token.ID });
            const updateSetting = yield (0, setting_service_1.settingClubService)(body);
            return res.json(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: true, message: "Setting Club successfully" }), secretKey));
        }
        catch (error) {
            return res.json(yield (0, encrypt_1.encrypt)(JSON.stringify({ status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "" }), secretKey));
        }
    });
}
exports.settingClubController = settingClubController;
//# sourceMappingURL=setting-club.controller.js.map