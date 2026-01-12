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
exports.showCardClubPlay = void 0;
const auth_token_1 = require("src/api/middleware/auth.token");
const club_play_repository_1 = require("src/repository/club-play.repository");
function showCardClubPlay(io, socket, data) {
    var _a, _b, _c, _d, _e, _f, _g;
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
                        socket.emit('res:error-message', { message: 'Club Play Room is not found.' });
                    }
                    else {
                        // In Hand Card
                        const userCard = getPlayer.USERS.map((data) => {
                            const sum = data.IN_HAND_CARDS.reduce((accumulator, currentValue) => accumulator + currentValue.rank.value, 0);
                            return {
                                CURRENT_TOTAL: sum,
                                IS_JOINT_ROOM: data === null || data === void 0 ? void 0 : data.IS_JOINT_ROOM,
                                IS_LEAVE_ROOM: data === null || data === void 0 ? void 0 : data.IS_LEAVE_ROOM,
                                CARD_LENGTH: data === null || data === void 0 ? void 0 : data.IN_HAND_CARDS.length,
                                IN_HAND_CARDS: data === null || data === void 0 ? void 0 : data.IN_HAND_CARDS,
                                USER_ID: data === null || data === void 0 ? void 0 : data.USER_ID,
                                IS_PENALTY_SCORE: data === null || data === void 0 ? void 0 : data.IS_PENALTY_SCORE,
                                PENALTY_COUNT: data === null || data === void 0 ? void 0 : data.PENALTY_COUNT
                            };
                        });
                        // All Player
                        const result = getPlayer.USERS.map((data) => {
                            const sum = data.IN_HAND_CARDS.reduce((accumulator, currentValue) => accumulator + currentValue.rank.value, 0);
                            return {
                                TOTAL: data === null || data === void 0 ? void 0 : data.TOTAL,
                                CONNECTION_ID: data === null || data === void 0 ? void 0 : data.CONNECTION_ID,
                                ROUNDS: data === null || data === void 0 ? void 0 : data.ROUNDS,
                                IS_JOINT_ROOM: data === null || data === void 0 ? void 0 : data.IS_JOINT_ROOM,
                                IS_LEAVE_ROOM: data === null || data === void 0 ? void 0 : data.IS_LEAVE_ROOM,
                                CURRENT_TOTAL: sum,
                                CARD_LENGTH: data === null || data === void 0 ? void 0 : data.IN_HAND_CARDS.length,
                                IN_HAND_CARDS: [],
                                USER_ID: data === null || data === void 0 ? void 0 : data.USER_ID,
                                IS_PENALTY_SCORE: data === null || data === void 0 ? void 0 : data.IS_PENALTY_SCORE,
                                PENALTY_COUNT: data === null || data === void 0 ? void 0 : data.PENALTY_COUNT
                            };
                        });
                        console.log(`Result  ${JSON.stringify(result)}`);
                        // Filter Leave Player or Remove 
                        const scoreCard = result.filter((data) => data.CURRENT_TOTAL > 0);
                        const inHandCard = userCard.filter((data) => data.CURRENT_TOTAL > 0).map((data) => {
                            return {
                                IN_HAND_CARDS: data === null || data === void 0 ? void 0 : data.IN_HAND_CARDS,
                                USER_ID: data === null || data === void 0 ? void 0 : data.USER_ID
                            };
                        });
                        const minTotalObj = scoreCard.reduce((minObj, currentObj) => {
                            return currentObj.CURRENT_TOTAL <= minObj.CURRENT_TOTAL ? currentObj : minObj;
                        }, result[0]);
                        const showPlayerId = isAuthorized.ID;
                        let isWinner = minTotalObj.USER_ID === showPlayerId;
                        for (let index = 0; index < result.length; index++) {
                            const element = result[index].USER_ID;
                            const total = result[index].CURRENT_TOTAL;
                            if (isWinner && element === showPlayerId) {
                                result[index].ROUNDS[result[index].ROUNDS.length - 1] = 0;
                                const add = [...result[index].ROUNDS, 0];
                                result[index].ROUNDS = add;
                                result[index].TOTAL += 0;
                                result[index].CURRENT_SCORE = 0;
                                result[index].IS_PENALTY_SCORE = false;
                                result[index].PENALTY_COUNT += 0;
                            }
                            else if (!isWinner && element === showPlayerId) {
                                result[index].ROUNDS[result[index].ROUNDS.length - 1] = total + 30;
                                const add = [...result[index].ROUNDS, 0];
                                result[index].ROUNDS = add;
                                result[index].TOTAL += total + 30;
                                result[index].CURRENT_SCORE = total + 30;
                                result[index].IS_PENALTY_SCORE = true;
                                result[index].PENALTY_COUNT += 1;
                            }
                            else {
                                if (!isWinner) {
                                    result[index].ROUNDS[result[index].ROUNDS.length - 1] = 0;
                                    const add = [...result[index].ROUNDS, 0];
                                    result[index].ROUNDS = add;
                                    result[index].TOTAL += 0;
                                    result[index].CURRENT_SCORE = 0;
                                    result[index].IS_PENALTY_SCORE = false;
                                    result[index].PENALTY_COUNT += 0;
                                }
                                else {
                                    result[index].ROUNDS[result[index].ROUNDS.length - 1] = total;
                                    const add = [...result[index].ROUNDS, 0];
                                    result[index].ROUNDS = add;
                                    result[index].TOTAL += total;
                                    result[index].CURRENT_SCORE = total;
                                    result[index].IS_PENALTY_SCORE = false;
                                    result[index].PENALTY_COUNT += 0;
                                }
                            }
                        }
                        const showResultCard = result;
                        // Check Game Is Over Or Not
                        const filterUser = result.filter((data) => (!data.IS_LEAVE_ROOM && data.TOTAL < 100));
                        const isNextRound = filterUser.length > 1;
                        const infoRound = getPlayer === null || getPlayer === void 0 ? void 0 : getPlayer.ROUND_INFO;
                        const filterData = infoRound === null || infoRound === void 0 ? void 0 : infoRound.filter((data) => !data.END_DATE);
                        const partcipatedUser = (_a = filterData === null || filterData === void 0 ? void 0 : filterData[0]) === null || _a === void 0 ? void 0 : _a.PARTICIPATED_USERS;
                        filterData[0].END_DATE = new Date();
                        for (let index = 0; index < partcipatedUser.length; index++) {
                            const userId = partcipatedUser[index];
                            const score = result === null || result === void 0 ? void 0 : result.filter((data) => data.USER_ID === userId.USER_ID);
                            console.log(score);
                            partcipatedUser[index].SCORE = (_b = score[0]) === null || _b === void 0 ? void 0 : _b.CURRENT_SCORE;
                        }
                        console.log(`PARTICIPATED_USERS :  ${JSON.stringify(infoRound)}`);
                        filterData[0].PARTICIPATED_USERS.sort((a, b) => a.SCORE - b.SCORE);
                        for (let i = 0; i < partcipatedUser.length; i++) {
                            partcipatedUser[i].RANK = i + 1;
                        }
                        console.log(`PARTICIPATED_USERS :  ${JSON.stringify(infoRound)}`);
                        if (isNextRound) {
                            let updated = yield (0, club_play_repository_1.updateAndReturnById)(ID, {
                                TURN_DECIDE_DECK: [],
                                GAME_DECK: [],
                                DROP_DECK: [],
                                CURRENT_DROP_DECK: [],
                                PREVIOUS_DROP_DECK: [],
                                CURRENT_TURN: minTotalObj.USER_ID,
                                CURRENT_ROUND_NUMBER: getPlayer.CURRENT_ROUND_NUMBER + 1,
                                USERS: showResultCard,
                                ROUND_INFO: infoRound
                            });
                            let cardDistributedLength = filterUser.findIndex((data) => data.USER_ID == minTotalObj.USER_ID);
                            const cardDistributedPlayer = (cardDistributedLength - 1 + filterUser.length) % filterUser.length;
                            // Next Round - Increment Round And Round Winner ID
                            io.of('/club-play').in(ID).emit('res:show-club-play', {
                                status: true,
                                show_In_ClubPlay: {
                                    ALL_USERS_TOTAL: showResultCard,
                                    NEXT_ROUND_USERS: filterUser,
                                    WIN_USER: minTotalObj.USER_ID,
                                    DISTRIBUTED_CARD_PLAYER: (_c = filterUser[cardDistributedPlayer]) === null || _c === void 0 ? void 0 : _c.USER_ID,
                                    IS_GAME_OVER: !isNextRound,
                                    SHOW_USER_ID: isAuthorized === null || isAuthorized === void 0 ? void 0 : isAuthorized.ID,
                                    ROUND_INFO: infoRound,
                                    IN_HAND_CARD: inHandCard
                                }
                            });
                        }
                        else {
                            let updated = yield (0, club_play_repository_1.updateAndReturnById)(ID, {
                                TURN_DECIDE_DECK: [],
                                GAME_DECK: [],
                                DROP_DECK: [],
                                CURRENT_DROP_DECK: [],
                                PREVIOUS_DROP_DECK: [],
                                IS_GAME_FINISH: true,
                                USERS: showResultCard,
                                GAME_FINISH_DATE: new Date(),
                                ROUND_INFO: infoRound
                            });
                            const input = typeof ((_d = updated === null || updated === void 0 ? void 0 : updated.raw[0]) === null || _d === void 0 ? void 0 : _d.ROUND_INFO) === 'string' ? JSON.parse((_e = updated === null || updated === void 0 ? void 0 : updated.raw[0]) === null || _e === void 0 ? void 0 : _e.ROUND_INFO) : (_f = updated === null || updated === void 0 ? void 0 : updated.raw[0]) === null || _f === void 0 ? void 0 : _f.ROUND_INFO;
                            console.log(`Input :::: ${JSON.stringify(input)}`);
                            const getLastRoundScores = {}; // Store the last round scores and ranks for each user
                            const allUsers = {};
                            const output = input.map((roundData) => {
                                console.log(`Data :::: ${JSON.stringify(roundData)}`);
                                const partcipatedUser = typeof (roundData === null || roundData === void 0 ? void 0 : roundData.PARTICIPATED_USERS) === 'string' ? JSON.parse(roundData === null || roundData === void 0 ? void 0 : roundData.PARTICIPATED_USERS) : roundData === null || roundData === void 0 ? void 0 : roundData.PARTICIPATED_USERS;
                                console.log(`Data :::: ${partcipatedUser}`);
                                partcipatedUser === null || partcipatedUser === void 0 ? void 0 : partcipatedUser.forEach(user => {
                                    if (!getLastRoundScores[user.USER_ID] || roundData.ROUND_NO > getLastRoundScores[user.USER_ID].ROUND) {
                                        getLastRoundScores[user.USER_ID] = {
                                            ROUND: roundData.ROUND_NO,
                                            SCORE: user.SCORE,
                                            RANK: user.RANK
                                        };
                                    }
                                    allUsers[user.USER_ID] = true;
                                });
                                return {
                                    ROUNDS: {
                                        USER_LIST: partcipatedUser === null || partcipatedUser === void 0 ? void 0 : partcipatedUser.map(user => {
                                            return {
                                                ROUND: roundData.ROUND_NO,
                                                RANK: user.RANK,
                                                SCORE: user.SCORE,
                                                USER_ID: user.USER_ID
                                            };
                                        })
                                    }
                                };
                            });
                            // Add non-participating users with their last recorded scores and ranks
                            Object.keys(allUsers).forEach(userId => {
                                for (let index = 1; index < output.length; index++) {
                                    if (!output[index].ROUNDS.USER_LIST.find(user => user.USER_ID === userId)) {
                                        output[index].ROUNDS.USER_LIST.push({
                                            ROUND: output.length,
                                            RANK: getLastRoundScores[userId].RANK,
                                            SCORE: getLastRoundScores[userId].SCORE,
                                            USER_ID: userId
                                        });
                                    }
                                }
                            });
                            io.of('/club-play').in(ID).emit('res:win-game-club-play', {
                                status: true,
                                win_game_In_ClubPlay: {
                                    ALL_USERS_TOTAL: showResultCard,
                                    WIN_USER: minTotalObj.USER_ID,
                                    IS_GAME_OVER: !isNextRound,
                                    SHOW_USER_ID: isAuthorized === null || isAuthorized === void 0 ? void 0 : isAuthorized.ID,
                                    ROUND_INFO: infoRound,
                                    IN_HAND_CARD: inHandCard,
                                    RANK_SCORE_PER_ROUND: output
                                }
                            });
                        }
                    }
                }
            }
        }
        catch (error) {
            socket.emit('res:error-message', { status: false, message: (_g = error === null || error === void 0 ? void 0 : error.message) !== null && _g !== void 0 ? _g : "Unknown Error." });
        }
    });
}
exports.showCardClubPlay = showCardClubPlay;
//# sourceMappingURL=show-card.js.map