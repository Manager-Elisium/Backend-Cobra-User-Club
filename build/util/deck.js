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
exports.findHighestCard = exports.getDeckSize = exports.drawCard = exports.shuffleDeck = exports.createDeck = exports.cardToString = exports.createCard = void 0;
/**
 *
 * @description Common Service => Create Card
 *
 */
function createCard(rank, suit) {
    return __awaiter(this, void 0, void 0, function* () {
        return { rank, suit };
    });
}
exports.createCard = createCard;
/**
 *
 * @description Card String
 *
 */
function cardToString(card) {
    return __awaiter(this, void 0, void 0, function* () {
        return `${card.rank.name} of ${card.suit}`;
    });
}
exports.cardToString = cardToString;
/**
 *
 * @description Create Deck (One Deck)
 *
 */
function createDeck() {
    return __awaiter(this, void 0, void 0, function* () {
        const ranks = [
            { name: 'Ace', value: 1 },
            { name: '2', value: 2 },
            { name: '3', value: 3 },
            { name: '4', value: 4 },
            { name: '5', value: 5 },
            { name: '6', value: 6 },
            { name: '7', value: 7 },
            { name: '8', value: 8 },
            { name: '9', value: 9 },
            { name: '10', value: 10 },
            { name: 'Jack', value: 11 },
            { name: 'Queen', value: 12 },
            { name: 'King', value: 13 }
        ];
        const suits = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
        const deck = [];
        for (const suit of suits) {
            for (const rank of ranks) {
                deck.push(yield createCard(rank, suit));
            }
        }
        return deck;
    });
}
exports.createDeck = createDeck;
/**
 *
 * @description Shuffle Card (One Deck)
 *
 */
function shuffleDeck(deck) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    });
}
exports.shuffleDeck = shuffleDeck;
/**
 *
 * @description Draw single card
 *
 */
function drawCard(deck) {
    return __awaiter(this, void 0, void 0, function* () {
        return deck.pop();
    });
}
exports.drawCard = drawCard;
/**
 *
 * @description Get Deck Size
 *
 */
function getDeckSize(deck) {
    return __awaiter(this, void 0, void 0, function* () {
        return deck.length;
    });
}
exports.getDeckSize = getDeckSize;
/**
 *
 * @description Find Highest Card With Player
 *
 */
function findHighestCard(players) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return __awaiter(this, void 0, void 0, function* () {
        let highestCard;
        let highestPlayerIndex;
        let highestPriority = -1;
        const suitPriority = {
            'Spades': 4,
            'Hearts': 3,
            'Diamonds': 2,
            'Clubs': 1
        };
        for (let i = 0; i < players.length; i++) {
            const currentPlayerCards = players[i].TURN_CARD;
            if (!highestPlayerIndex) {
                highestCard = currentPlayerCards === null || currentPlayerCards === void 0 ? void 0 : currentPlayerCards[0];
                highestPlayerIndex = players === null || players === void 0 ? void 0 : players[i].USER_ID;
                highestPriority = suitPriority[currentPlayerCards === null || currentPlayerCards === void 0 ? void 0 : currentPlayerCards[0].suit];
            }
            else {
                if (((_b = (_a = currentPlayerCards === null || currentPlayerCards === void 0 ? void 0 : currentPlayerCards[0]) === null || _a === void 0 ? void 0 : _a.rank) === null || _b === void 0 ? void 0 : _b.value) > ((_c = highestCard === null || highestCard === void 0 ? void 0 : highestCard.rank) === null || _c === void 0 ? void 0 : _c.value)) {
                    highestCard = currentPlayerCards === null || currentPlayerCards === void 0 ? void 0 : currentPlayerCards[0];
                    highestPlayerIndex = (_d = players === null || players === void 0 ? void 0 : players[i]) === null || _d === void 0 ? void 0 : _d.USER_ID;
                    highestPriority = suitPriority[(_e = currentPlayerCards === null || currentPlayerCards === void 0 ? void 0 : currentPlayerCards[0]) === null || _e === void 0 ? void 0 : _e.suit];
                }
                else if (((_g = (_f = currentPlayerCards === null || currentPlayerCards === void 0 ? void 0 : currentPlayerCards[0]) === null || _f === void 0 ? void 0 : _f.rank) === null || _g === void 0 ? void 0 : _g.value) == ((_h = highestCard === null || highestCard === void 0 ? void 0 : highestCard.rank) === null || _h === void 0 ? void 0 : _h.value)) {
                    if (suitPriority[currentPlayerCards[0].suit] > highestPriority) {
                        highestCard = currentPlayerCards[0];
                        highestPlayerIndex = players[i].USER_ID;
                        highestPriority = suitPriority[currentPlayerCards[0].suit];
                    }
                }
            }
        }
        return { highestPlayerIndex, highestCard };
    });
}
exports.findHighestCard = findHighestCard;
//# sourceMappingURL=deck.js.map