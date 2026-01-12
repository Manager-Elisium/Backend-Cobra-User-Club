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
exports.chatCLubPlay = void 0;
const auth_token_1 = require("src/api/middleware/auth.token");
const club_play_repository_1 = require("src/repository/club-play.repository");
function chatCLubPlay(io, socket, data) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { Authtoken: token, ROOM_NAME: ID } = JSON.parse(data);
            if (!token) {
                socket.emit('res:unauthorized', { message: 'You are not authorized to perform this action.' });
            }
            else {
                const isAuthorized = yield (0, auth_token_1.verifyAccessToken)(token);
                if (!isAuthorized) {
                    socket.emit('res:unauthorized', { message: 'You are not authorized to perform this action.' });
                }
                else {
                    const getPlayer = yield (0, club_play_repository_1.findOne)({ ID });
                    if (!getPlayer) {
                        socket.emit('res:error-message', { message: 'Table is not found.' });
                    }
                    else {
                        const { TYPE, SENDER_USER_ID, SEND_MESSAGE } = JSON.parse(data);
                        socket.to(getPlayer === null || getPlayer === void 0 ? void 0 : getPlayer.ID).emit('res:chat-club-play', {
                            status: true,
                            chat_In_FriendPlay: {
                                TYPE,
                                RECEIVE_USER_ID: SENDER_USER_ID,
                                SEND_MESSAGE
                            }
                        });
                    }
                }
            }
        }
        catch (error) {
            socket.emit('res:error-message', { status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Unknown Error." });
        }
    });
}
exports.chatCLubPlay = chatCLubPlay;
//# sourceMappingURL=chat-room.js.map