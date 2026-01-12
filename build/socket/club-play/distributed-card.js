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
exports.distributedCardTablePlay = void 0;
const deck_1 = require("src/util/deck");
const club_play_repository_1 = require("src/repository/club-play.repository");
const auth_token_1 = require("src/api/middleware/auth.token");
function distributedCardTablePlay(io, socket, data) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
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
                        // Add Suffle and Store Database
                        const CreateDeck = yield (0, deck_1.createDeck)();
                        const deck = [...CreateDeck, ...CreateDeck, ...CreateDeck,
                            ...CreateDeck, ...CreateDeck, ...CreateDeck];
                        const randomDeck = yield (0, deck_1.shuffleDeck)(deck);
                        const USERS = [];
                        const listUser = (_a = getPlayer === null || getPlayer === void 0 ? void 0 : getPlayer.USERS) === null || _a === void 0 ? void 0 : _a.filter((data) => (!data.IS_LEAVE_ROOM && data.TOTAL < 100));
                        const viewerUser = (_b = getPlayer === null || getPlayer === void 0 ? void 0 : getPlayer.USERS) === null || _b === void 0 ? void 0 : _b.filter((data) => (data.IS_LEAVE_ROOM || data.TOTAL > 100));
                        console.log(listUser);
                        for (let index = 0; index < listUser.length; index++) {
                            const REQ_USER_ID = listUser[index].USER_ID;
                            const IN_HAND_CARDS = [];
                            for (let drawIndex = 0; drawIndex < 7; drawIndex++) {
                                const DrawCard = yield (0, deck_1.drawCard)(randomDeck);
                                IN_HAND_CARDS.push(DrawCard);
                            }
                            USERS.push({
                                USER_ID: REQ_USER_ID,
                                USER_CLUB_ID: data === null || data === void 0 ? void 0 : data.USER_CLUB_ID,
                                IN_HAND_CARDS: IN_HAND_CARDS,
                                CONNECTION_ID: (_c = listUser[index]) === null || _c === void 0 ? void 0 : _c.CONNECTION_ID,
                                TOTAL: (_d = listUser[index]) === null || _d === void 0 ? void 0 : _d.TOTAL,
                                ROUNDS: (_e = listUser[index]) === null || _e === void 0 ? void 0 : _e.ROUNDS,
                                IS_JOINT_ROOM: (_f = listUser[index]) === null || _f === void 0 ? void 0 : _f.IS_JOINT_ROOM,
                                IS_LEAVE_ROOM: (_g = listUser[index]) === null || _g === void 0 ? void 0 : _g.IS_LEAVE_ROOM,
                                CURRENT_TOTAL: 0,
                                CARD_LENGTH: 7,
                                IS_PENALTY_SCORE: false,
                                PENALTY_COUNT: (_h = listUser[index]) === null || _h === void 0 ? void 0 : _h.PENALTY_COUNT
                            });
                            io.of('/club-play').to(USERS[index].CONNECTION_ID).emit('res:seven-card-distributed-table-play', {
                                status: true,
                                sevenCard_In_TablePlay: {
                                    USER_ID: REQ_USER_ID,
                                    USER_CLUB_ID: data === null || data === void 0 ? void 0 : data.USER_CLUB_ID,
                                    IN_HAND_CARDS: IN_HAND_CARDS,
                                    CONNECTION_ID: (_j = listUser[index]) === null || _j === void 0 ? void 0 : _j.CONNECTION_ID,
                                    TOTAL: (_k = listUser[index]) === null || _k === void 0 ? void 0 : _k.TOTAL,
                                    ROUNDS: (_l = listUser[index]) === null || _l === void 0 ? void 0 : _l.ROUNDS,
                                    IS_JOINT_ROOM: (_m = listUser[index]) === null || _m === void 0 ? void 0 : _m.IS_JOINT_ROOM,
                                    IS_LEAVE_ROOM: (_o = listUser[index]) === null || _o === void 0 ? void 0 : _o.IS_LEAVE_ROOM,
                                    CURRENT_TOTAL: 0,
                                    CARD_LENGTH: 7
                                }
                            });
                            console.log(listUser.length);
                            if (listUser.length === index + 1) {
                                /// Round Win Player Send
                                io.of('/club-play').in(ID).emit("res:game-start-table-play", {
                                    status: true,
                                    message: "Game Start.",
                                    startGame_In_TablePlay: {
                                        TURN_PLAYER: getPlayer.CURRENT_TURN
                                    }
                                });
                            }
                        }
                        for (let index = 0; index < viewerUser.length; index++) {
                            USERS.push({
                                USER_ID: (_p = viewerUser[index]) === null || _p === void 0 ? void 0 : _p.USER_ID,
                                USER_CLUB_ID: data === null || data === void 0 ? void 0 : data.USER_CLUB_ID,
                                IN_HAND_CARDS: [],
                                CONNECTION_ID: (_q = viewerUser[index]) === null || _q === void 0 ? void 0 : _q.CONNECTION_ID,
                                TOTAL: (_r = viewerUser[index]) === null || _r === void 0 ? void 0 : _r.TOTAL,
                                ROUNDS: (_s = viewerUser[index]) === null || _s === void 0 ? void 0 : _s.ROUNDS,
                                IS_JOINT_ROOM: (_t = viewerUser[index]) === null || _t === void 0 ? void 0 : _t.IS_JOINT_ROOM,
                                IS_LEAVE_ROOM: (_u = viewerUser[index]) === null || _u === void 0 ? void 0 : _u.IS_LEAVE_ROOM,
                                CURRENT_TOTAL: (_v = viewerUser[index]) === null || _v === void 0 ? void 0 : _v.CURRENT_TOTAL,
                                CARD_LENGTH: 7,
                                IS_PENALTY_SCORE: false,
                                PENALTY_COUNT: (_w = viewerUser[index]) === null || _w === void 0 ? void 0 : _w.PENALTY_COUNT
                            });
                            io.of('/club-play').to((_x = viewerUser[index]) === null || _x === void 0 ? void 0 : _x.CONNECTION_ID).emit('res:view-seven-card-distributed-table-play', {
                                status: true
                            });
                        }
                        const infoRound = getPlayer === null || getPlayer === void 0 ? void 0 : getPlayer.ROUND_INFO;
                        const partcipatedUser = listUser === null || listUser === void 0 ? void 0 : listUser.map((data) => ({
                            USER_ID: data === null || data === void 0 ? void 0 : data.USER_ID,
                            SCORE: -1,
                            RANK: -1
                        }));
                        if (infoRound.length === 0) {
                            infoRound.push({
                                "START_DATE": new Date(),
                                "END_DATE": null,
                                "ROUND_NO": 1,
                                "PARTICIPATED_USERS": partcipatedUser
                            });
                        }
                        else {
                            infoRound.push({
                                "START_DATE": new Date(),
                                "END_DATE": null,
                                "ROUND_NO": infoRound.length + 1,
                                "PARTICIPATED_USERS": partcipatedUser
                            });
                        }
                        yield (0, club_play_repository_1.updateAndReturnById)(ID, { GAME_DECK: randomDeck, USERS: USERS, ROUND_INFO: infoRound });
                    }
                }
            }
        }
        catch (error) {
            console.log(error);
            socket.emit('res:error-message', { status: false, message: (_y = error === null || error === void 0 ? void 0 : error.message) !== null && _y !== void 0 ? _y : "Unknown Error." });
        }
    });
}
exports.distributedCardTablePlay = distributedCardTablePlay;
//# sourceMappingURL=distributed-card.js.map