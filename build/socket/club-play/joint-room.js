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
exports.jointRoomTablePlay = void 0;
const auth_token_1 = require("src/api/middleware/auth.token");
const deck_1 = require("src/util/deck");
const club_play_repository_1 = require("src/repository/club-play.repository");
function jointRoomTablePlay(io, socket, data) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { Authtoken: token, ROOM_NAME: ID } = JSON.parse(data);
            if (!token) {
                socket.emit('res:unauthorized', { message: 'You are not authorized to perform this action.' });
            }
            else {
                const isAuthorized = yield (0, auth_token_1.verifyAccessToken)(token);
                if (!isAuthorized) {
                    socket.emit('res:unauthorized', { status: false, message: 'You are not authorized to perform this action.' });
                }
                else {
                    const getPlayer = yield (0, club_play_repository_1.findOne)({ ID });
                    if (!getPlayer) {
                        socket.emit('res:error-message', { status: false, message: 'Table Player is not found.' });
                    }
                    else {
                        socket.join(ID);
                        if (!getPlayer.TURN_DECIDE_DECK) {
                            const shuffleTurnDeck = yield (0, deck_1.createDeck)();
                            const deck = yield (0, deck_1.shuffleDeck)(shuffleTurnDeck);
                            const drawnCard = yield (0, deck_1.drawCard)(deck);
                            const card = [];
                            for (let index = 0; index < getPlayer.USERS.length; index++) {
                                const USER_ID = getPlayer.USERS[index].USER_ID;
                                if (isAuthorized.ID === USER_ID) {
                                    getPlayer.USERS[index].IS_JOINT_ROOM = true;
                                    getPlayer.USERS[index].CONNECTION_ID = socket.id;
                                    card.push(drawnCard);
                                    getPlayer.USERS[index].TURN_CARD = card;
                                    break;
                                }
                            }
                            console.log(getPlayer.USERS);
                            yield (0, club_play_repository_1.updateAndReturnById)(ID, { TURN_DECIDE_DECK: deck, USERS: getPlayer.USERS });
                            socket.emit("res:joint-room-in-table-play", {
                                status: true,
                                message: `${isAuthorized.ID} is successfully joint ${ID} room.`,
                                jointRoom_In_ClubPlay: {
                                    IS_LAST_USER: false,
                                    USER_ID: isAuthorized === null || isAuthorized === void 0 ? void 0 : isAuthorized.ID,
                                    ROOM_NAME: ID
                                }
                            });
                        }
                        else {
                            const deck = yield (0, deck_1.shuffleDeck)(getPlayer.TURN_DECIDE_DECK);
                            const drawnCard = yield (0, deck_1.drawCard)(deck);
                            const card = [];
                            for (let index = 0; index < getPlayer.USERS.length; index++) {
                                const USER_ID = getPlayer.USERS[index].USER_ID;
                                if (isAuthorized.ID === USER_ID) {
                                    getPlayer.USERS[index].IS_JOINT_ROOM = true;
                                    getPlayer.USERS[index].CONNECTION_ID = socket.id;
                                    card.push(drawnCard);
                                    getPlayer.USERS[index].TURN_CARD = card;
                                    break;
                                }
                            }
                            let updated = yield (0, club_play_repository_1.updateAndReturnById)(ID, { TURN_DECIDE_DECK: deck, USERS: getPlayer.USERS });
                            console.log(updated.raw[0].USERS.filter((data) => !data.IS_JOINT_ROOM));
                            const isLastUser = (_a = updated === null || updated === void 0 ? void 0 : updated.raw[0]) === null || _a === void 0 ? void 0 : _a.USERS.filter((data) => !(data === null || data === void 0 ? void 0 : data.IS_JOINT_ROOM));
                            console.log(isLastUser);
                            socket.emit("res:joint-room-in-table-play", {
                                status: true,
                                message: `${isAuthorized.ID} is successfully joint ${ID} room.`,
                                jointRoom_In_ClubPlay: {
                                    IS_LAST_USER: isLastUser.length === 0,
                                    USER_ID: isAuthorized === null || isAuthorized === void 0 ? void 0 : isAuthorized.ID,
                                    ROOM_NAME: ID
                                }
                            });
                        }
                    }
                }
            }
        }
        catch (error) {
            socket.emit('res:error-message', { status: false, message: (_b = error === null || error === void 0 ? void 0 : error.message) !== null && _b !== void 0 ? _b : "Unknown Error." });
        }
    });
}
exports.jointRoomTablePlay = jointRoomTablePlay;
//# sourceMappingURL=joint-room.js.map