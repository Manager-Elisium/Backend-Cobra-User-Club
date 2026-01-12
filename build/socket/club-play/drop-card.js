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
exports.dropCardTablePlay = void 0;
const auth_token_1 = require("src/api/middleware/auth.token");
const club_play_repository_1 = require("src/repository/club-play.repository");
function dropCardTablePlay(io, socket, data) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(`DROP CARD : ${JSON.parse(data)}`);
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
                        const { DROP_CARD } = JSON.parse(data);
                        const DB_DROP_DECK = getPlayer === null || getPlayer === void 0 ? void 0 : getPlayer.DROP_DECK;
                        const CURRENT_DROP_DECK = [...DROP_CARD];
                        const DROP_DECK = [...DROP_CARD, ...DB_DROP_DECK];
                        // Pending Logic For Remove Card in USERS
                        const user = (_a = getPlayer === null || getPlayer === void 0 ? void 0 : getPlayer.USERS) === null || _a === void 0 ? void 0 : _a.find(obj => obj.USER_ID === isAuthorized.ID);
                        let remainingCards = user.IN_HAND_CARDS.filter(card => {
                            let matchingCards = DROP_CARD.filter(removeCard => removeCard.rank.name === card.rank.name && removeCard.rank.value === card.rank.value && removeCard.suit === card.suit);
                            if (matchingCards.length > 0) {
                                DROP_CARD.splice(DROP_CARD.indexOf(matchingCards[0]), 1);
                                return false;
                            }
                            return true;
                        });
                        console.log(remainingCards);
                        const newArray = (_b = getPlayer === null || getPlayer === void 0 ? void 0 : getPlayer.USERS) === null || _b === void 0 ? void 0 : _b.map(user => (user === null || user === void 0 ? void 0 : user.USER_ID) === isAuthorized.ID ? Object.assign(Object.assign({}, user), { IN_HAND_CARDS: remainingCards }) : user);
                        console.log(newArray);
                        let updated = yield (0, club_play_repository_1.updateAndReturnById)(ID, { CURRENT_DROP_DECK: CURRENT_DROP_DECK, USERS: newArray });
                        io.of('/club-play').in(ID).emit("res:drop-card-table-play", {
                            status: true,
                            dropCard_In_TablePlay: {
                                DROP_DECK: DROP_DECK,
                                PREVIOUS_DROP_CARDS: getPlayer === null || getPlayer === void 0 ? void 0 : getPlayer.PREVIOUS_DROP_DECK,
                                CURRENT_DROP_CARDS: (_c = updated === null || updated === void 0 ? void 0 : updated.raw[0]) === null || _c === void 0 ? void 0 : _c.CURRENT_DROP_DECK
                            }
                        });
                        socket.emit('res:remaining-card-table-play', {
                            status: true,
                            remainingCard_In_TablePlay: {
                                MY_CARD: remainingCards
                            }
                        });
                    }
                }
            }
        }
        catch (error) {
            socket.emit('res:error-message', { status: false, message: (_d = error === null || error === void 0 ? void 0 : error.message) !== null && _d !== void 0 ? _d : "Unknown Error." });
        }
    });
}
exports.dropCardTablePlay = dropCardTablePlay;
//# sourceMappingURL=drop-card.js.map