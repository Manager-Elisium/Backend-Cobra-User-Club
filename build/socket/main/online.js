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
exports.onlineUser = void 0;
const auth_token_1 = require("src/api/middleware/auth.token");
function onlineUser(socket, data) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { Authtoken: token } = JSON.parse(data);
            if (!token) {
                socket.emit('res:unauthorized', { message: 'You are not authorized to perform this action.' });
            }
            else {
                const isAuthorized = yield (0, auth_token_1.verifyAccessToken)(token);
                if (!isAuthorized) {
                    socket.emit('res:unauthorized', { status: false, message: 'You are not authorized to perform this action.' });
                }
                else {
                }
            }
        }
        catch (error) {
            socket.emit('res:error-message', { status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Unknown Error." });
        }
    });
}
exports.onlineUser = onlineUser;
//# sourceMappingURL=online.js.map