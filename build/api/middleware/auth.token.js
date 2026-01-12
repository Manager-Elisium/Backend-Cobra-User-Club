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
exports.verifyAccessTokenRestApi = exports.verifyAccessToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const error_type_1 = require("src/common/error-type");
function verifyAccessToken(token) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (token) {
            try {
                const decoded = yield (0, jsonwebtoken_1.verify)(token, (_a = process.env.AUTH_KEY) !== null && _a !== void 0 ? _a : "");
                // console.log(decoded);
                return decoded;
            }
            catch (error) {
                console.error(JSON.stringify(error));
                return false;
            }
        }
        else {
            return false;
        }
    });
}
exports.verifyAccessToken = verifyAccessToken;
function verifyAccessTokenRestApi(request, response, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!(request === null || request === void 0 ? void 0 : request.headers["authorization"])) {
            return response
                .status(error_type_1.ErrorCodeMap.INVALID_AUTH)
                .json({ message: "Invalid Authorization." });
        }
        const authHeader = (_a = request === null || request === void 0 ? void 0 : request.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ");
        if (!authHeader[1]) {
            return response
                .status(error_type_1.ErrorCodeMap.INVALID_AUTH)
                .json({ message: "Invalid Authorization." });
        }
        return new Promise((resolve, reject) => {
            var _a;
            (0, jsonwebtoken_1.verify)(authHeader[1], (_a = process.env.AUTH_KEY) !== null && _a !== void 0 ? _a : "", (error, decoded) => {
                if (error) {
                    return response
                        .status(error_type_1.ErrorCodeMap.INVALID_AUTH)
                        .json({ message: error });
                }
                else {
                    request.body.token = JSON.parse(JSON.stringify(decoded));
                    next();
                }
            });
        });
    });
}
exports.verifyAccessTokenRestApi = verifyAccessTokenRestApi;
//# sourceMappingURL=auth.token.js.map