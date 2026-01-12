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
exports.decidedFirstRoundTurnTablePlay = void 0;
const deck_1 = require("src/util/deck");
const club_play_repository_1 = require("src/repository/club-play.repository");
const auth_token_1 = require("src/api/middleware/auth.token");
function decidedFirstRoundTurnTablePlay(io, socket, data) {
    var _a, _b, _c;
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
                        const highestCard = yield (0, deck_1.findHighestCard)(getPlayer.USERS);
                        if (highestCard) {
                            console.log('Highest card: ', yield (0, deck_1.cardToString)(highestCard.highestCard));
                            console.log('Player Number: ', highestCard.highestPlayerIndex);
                            let findFirstTurnIndex = getPlayer.USERS.findIndex((data) => data.USER_ID == highestCard.highestPlayerIndex);
                            const firstTurnPlayer = (findFirstTurnIndex + 1) % getPlayer.USERS.length;
                            let upDateRoom = getPlayer.USERS.map((data) => ({
                                USER_ID: data === null || data === void 0 ? void 0 : data.USER_ID,
                                USER_CLUB_ID: data === null || data === void 0 ? void 0 : data.USER_CLUB_ID,
                                CONNECTION_ID: data === null || data === void 0 ? void 0 : data.CONNECTION_ID,
                                TOTAL: data === null || data === void 0 ? void 0 : data.TOTAL,
                                ROUNDS: data === null || data === void 0 ? void 0 : data.ROUNDS,
                                IS_JOINT_ROOM: data === null || data === void 0 ? void 0 : data.IS_JOINT_ROOM,
                                IS_LEAVE_ROOM: data === null || data === void 0 ? void 0 : data.IS_LEAVE_ROOM,
                                IN_HAND_CARDS: data === null || data === void 0 ? void 0 : data.IN_HAND_CARDS,
                                CURRENT_TOTAL: 0,
                                CARD_LENGTH: 7,
                                IS_PENALTY_SCORE: false,
                                PENALTY_COUNT: data === null || data === void 0 ? void 0 : data.PENALTY_COUNT
                            }));
                            yield (0, club_play_repository_1.updateAndReturnById)(ID, { TURN_DECIDE_DECK: null, USERS: upDateRoom.USERS, CURRENT_TURN: (_a = getPlayer === null || getPlayer === void 0 ? void 0 : getPlayer.USERS[firstTurnPlayer]) === null || _a === void 0 ? void 0 : _a.USER_ID });
                            io.of('/club-play').in(ID).emit("res:decided-first-round-turn-table-play", {
                                status: true,
                                firstTurn_In_TablePlay: {
                                    DISTRIBUTED_CARD_PLAYER: highestCard === null || highestCard === void 0 ? void 0 : highestCard.highestPlayerIndex,
                                    FIRST_TURN_PLAYER: (_b = getPlayer === null || getPlayer === void 0 ? void 0 : getPlayer.USERS[firstTurnPlayer]) === null || _b === void 0 ? void 0 : _b.USER_ID,
                                    ALL_PLAYER_CARD: getPlayer === null || getPlayer === void 0 ? void 0 : getPlayer.USERS
                                }
                            });
                        }
                        else {
                            socket.emit('res:error-message', { status: false, message: 'Club Table Play is not found.' });
                        }
                    }
                }
            }
        }
        catch (error) {
            socket.emit('res:error-message', { status: false, message: (_c = error === null || error === void 0 ? void 0 : error.message) !== null && _c !== void 0 ? _c : "Unknown Error." });
        }
    });
}
exports.decidedFirstRoundTurnTablePlay = decidedFirstRoundTurnTablePlay;
//# sourceMappingURL=decide-turn.js.map