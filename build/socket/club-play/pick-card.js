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
exports.pickCardTablePlay = void 0;
const auth_token_1 = require("src/api/middleware/auth.token");
const club_play_repository_1 = require("src/repository/club-play.repository");
const deck_1 = require("src/util/deck");
function pickCardTablePlay(io, socket, data) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(JSON.parse(data));
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
                        const { IS_NEW_CARD } = JSON.parse(data);
                        // Filter User -- leave room and equal up to 100 
                        const listUser = getPlayer.USERS.filter((data) => (!data.IS_LEAVE_ROOM && data.TOTAL < 100));
                        // Find the index of the current USER_ID
                        const currentIndex = listUser.findIndex(user => user.USER_ID === isAuthorized.ID);
                        // Calculate the index of the next USER_ID
                        const nextIndex = (currentIndex + 1) % listUser.length;
                        // Get the next USER_ID
                        const nextUserId = listUser[nextIndex].USER_ID;
                        if (IS_NEW_CARD) {
                            const deck = yield (0, deck_1.shuffleDeck)(getPlayer === null || getPlayer === void 0 ? void 0 : getPlayer.GAME_DECK);
                            const DrawCard = yield (0, deck_1.drawCard)(deck);
                            const newArray = (_a = getPlayer === null || getPlayer === void 0 ? void 0 : getPlayer.USERS) === null || _a === void 0 ? void 0 : _a.map(user => (user === null || user === void 0 ? void 0 : user.USER_ID) === isAuthorized.ID ? Object.assign(Object.assign({}, user), { IN_HAND_CARDS: [...user.IN_HAND_CARDS, DrawCard] }) : user);
                            const DB_DROP_DECK = getPlayer === null || getPlayer === void 0 ? void 0 : getPlayer.DROP_DECK;
                            const DB_CURRENT_DROP_DECK = getPlayer === null || getPlayer === void 0 ? void 0 : getPlayer.CURRENT_DROP_DECK;
                            const PREVIOUS_DROP_DECK = getPlayer === null || getPlayer === void 0 ? void 0 : getPlayer.PREVIOUS_DROP_DECK;
                            const DROP_DECK = [...PREVIOUS_DROP_DECK, ...DB_DROP_DECK];
                            let updated = yield (0, club_play_repository_1.updateAndReturnById)(ID, { GAME_DECK: deck, DROP_DECK: DROP_DECK, CURRENT_DROP_DECK: [], PREVIOUS_DROP_DECK: getPlayer === null || getPlayer === void 0 ? void 0 : getPlayer.CURRENT_DROP_DECK, USERS: newArray, CURRENT_TURN: nextUserId });
                            socket.emit('res:pick-card-table-play', {
                                status: true,
                                pickCard_In_TablePlay: {
                                    PICK_CARD: DrawCard,
                                    IS_NEW_CARD
                                }
                            });
                            socket.to(ID).emit('res:animation-table-play', {
                                status: true,
                                animation_In_TablePlay: {
                                    IS_CARD_PICKUP: true,
                                    IS_NEW_CARD,
                                    PICK_CARD: {},
                                    CURRENT_DROP_DECK: DB_CURRENT_DROP_DECK
                                }
                            });
                        }
                        else {
                            const { PICK_CARD } = JSON.parse(data);
                            console.log(`Pick Card : ${PICK_CARD}`);
                            const PREVIOUS_DROP_DECK = getPlayer === null || getPlayer === void 0 ? void 0 : getPlayer.PREVIOUS_DROP_DECK;
                            console.log(`Previous Drop Deck : ${PREVIOUS_DROP_DECK}`);
                            const cardArray = [PICK_CARD];
                            let remainingCards = PREVIOUS_DROP_DECK.filter(card => {
                                let matchingCards = cardArray.filter(removeCard => removeCard.rank.name === card.rank.name && removeCard.rank.value === card.rank.value && removeCard.suit === card.suit);
                                if (matchingCards.length > 0) {
                                    cardArray.splice(cardArray.indexOf(matchingCards[0]), 1);
                                    return false;
                                }
                                return true;
                            });
                            console.log(`Remaing Card : ${JSON.stringify(remainingCards)}`);
                            const newArray = (_b = getPlayer === null || getPlayer === void 0 ? void 0 : getPlayer.USERS) === null || _b === void 0 ? void 0 : _b.map(user => (user === null || user === void 0 ? void 0 : user.USER_ID) === isAuthorized.ID ? Object.assign(Object.assign({}, user), { IN_HAND_CARDS: [...user.IN_HAND_CARDS, PICK_CARD] }) : user);
                            const DB_DROP_DECK = getPlayer === null || getPlayer === void 0 ? void 0 : getPlayer.DROP_DECK;
                            const DROP_DECK = [...remainingCards, ...DB_DROP_DECK];
                            const DB_CURRENT_DROP_DECK = getPlayer === null || getPlayer === void 0 ? void 0 : getPlayer.CURRENT_DROP_DECK;
                            let updated = yield (0, club_play_repository_1.updateAndReturnById)(ID, { DROP_DECK: DROP_DECK, CURRENT_DROP_DECK: [], PREVIOUS_DROP_DECK: getPlayer === null || getPlayer === void 0 ? void 0 : getPlayer.CURRENT_DROP_DECK, USERS: newArray, CURRENT_TURN: nextUserId });
                            socket.emit('res:pick-card-table-play', {
                                status: true,
                                pickCard_In_TablePlay: {
                                    PICK_CARD,
                                    IS_NEW_CARD
                                }
                            });
                            socket.to(ID).emit('res:animation-table-play', {
                                status: true,
                                animation_In_TablePlay: {
                                    IS_CARD_PICKUP: true,
                                    IS_NEW_CARD,
                                    PICK_CARD,
                                    CURRENT_DROP_DECK: DB_CURRENT_DROP_DECK
                                }
                            });
                        }
                        io.of('/club-play').in(ID).emit('res:next-turn-table-play', {
                            status: true,
                            nextTurn_In_TablePlay: {
                                CURRENT_TURN: nextUserId
                            }
                        });
                    }
                }
            }
        }
        catch (error) {
            console.log(`Error : ${error}`);
            socket.emit('res:error-message', { status: false, message: (_c = error === null || error === void 0 ? void 0 : error.message) !== null && _c !== void 0 ? _c : "Unknown Error." });
        }
    });
}
exports.pickCardTablePlay = pickCardTablePlay;
//# sourceMappingURL=pick-card.js.map