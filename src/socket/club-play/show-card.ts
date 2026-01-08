import { Socket } from 'socket.io';
import { verifyAccessToken } from 'src/api/middleware/auth.token';
import { findOne, updateAndReturnById } from 'src/repository/club-play.repository';


async function showCardClubPlay(io: any, socket: Socket, data: any) {
    try {
        const { Authtoken: token, ROOM_NAME: ID } = JSON.parse(data);
        if (!token) {
            socket.emit('res:unauthorized', { message: 'You are not authorized to perform this action.' });
        } else {
            const isAuthorized = await verifyAccessToken(token) as any;
            if (!isAuthorized) {
                socket.emit('res:unauthorized', { message: 'You are not authorized to perform this action.' });
            } else {
                const getPlayer = await findOne({ ID });
                if (!getPlayer) {
                    socket.emit('res:error-message', { message: 'Club Play Room is not found.' });
                } else {

                    // In Hand Card
                    const userCard = getPlayer.USERS.map((data) => {
                        const sum = data.IN_HAND_CARDS.reduce((accumulator, currentValue) => accumulator + currentValue.rank.value, 0);
                        return {
                            CURRENT_TOTAL: sum,
                            IS_JOINT_ROOM: data?.IS_JOINT_ROOM,
                            IS_LEAVE_ROOM: data?.IS_LEAVE_ROOM,
                            CARD_LENGTH: data?.IN_HAND_CARDS.length,
                            IN_HAND_CARDS: data?.IN_HAND_CARDS,
                            USER_ID: data?.USER_ID,
                            IS_PENALTY_SCORE: data?.IS_PENALTY_SCORE,
                            PENALTY_COUNT: data?.PENALTY_COUNT
                        };
                    });
                    // All Player
                    const result = getPlayer.USERS.map((data) => {
                        const sum = data.IN_HAND_CARDS.reduce((accumulator, currentValue) => accumulator + currentValue.rank.value, 0);
                        return {
                            TOTAL: data?.TOTAL,
                            CONNECTION_ID: data?.CONNECTION_ID,
                            ROUNDS: data?.ROUNDS,
                            IS_JOINT_ROOM: data?.IS_JOINT_ROOM,
                            IS_LEAVE_ROOM: data?.IS_LEAVE_ROOM,
                            CURRENT_TOTAL: sum,
                            CARD_LENGTH: data?.IN_HAND_CARDS.length,
                            IN_HAND_CARDS: [],
                            USER_ID: data?.USER_ID,
                            IS_PENALTY_SCORE: data?.IS_PENALTY_SCORE,
                            PENALTY_COUNT: data?.PENALTY_COUNT
                        };
                    });

                    console.log(`Result  ${JSON.stringify(result)}`);
                    // Filter Leave Player or Remove 
                    const scoreCard = result.filter((data) => data.CURRENT_TOTAL > 0)
                    const inHandCard = userCard.filter((data) => data.CURRENT_TOTAL > 0).map((data) => {
                        return {
                            IN_HAND_CARDS: data?.IN_HAND_CARDS,
                            USER_ID: data?.USER_ID
                        }
                    })

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
                        } else if (!isWinner && element === showPlayerId) {
                            result[index].ROUNDS[result[index].ROUNDS.length - 1] = total + 30;
                            const add = [...result[index].ROUNDS, 0]
                            result[index].ROUNDS = add;
                            result[index].TOTAL += total + 30;
                            result[index].CURRENT_SCORE = total + 30;
                            result[index].IS_PENALTY_SCORE = true;
                            result[index].PENALTY_COUNT += 1;
                        } else {
                            if (!isWinner) {
                                result[index].ROUNDS[result[index].ROUNDS.length - 1] = 0;
                                const add = [...result[index].ROUNDS, 0]
                                result[index].ROUNDS = add;
                                result[index].TOTAL += 0;
                                result[index].CURRENT_SCORE = 0;
                                result[index].IS_PENALTY_SCORE = false;
                                result[index].PENALTY_COUNT += 0;
                            } else {
                                result[index].ROUNDS[result[index].ROUNDS.length - 1] = total;
                                const add = [...result[index].ROUNDS, 0]
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

                    const infoRound = getPlayer?.ROUND_INFO;
                    const filterData = infoRound?.filter((data: any) => !data.END_DATE);

                    const partcipatedUser = filterData?.[0]?.PARTICIPATED_USERS;
                    filterData[0].END_DATE = new Date();

                    for (let index = 0; index < partcipatedUser.length; index++) {
                        const userId = partcipatedUser[index];
                        const score = result?.filter((data: any) => data.USER_ID === userId.USER_ID)
                        console.log(score)
                        partcipatedUser[index].SCORE = score[0]?.CURRENT_SCORE;
                    }

                    console.log(`PARTICIPATED_USERS :  ${JSON.stringify(infoRound)}`);
                    filterData[0].PARTICIPATED_USERS.sort((a, b) => a.SCORE - b.SCORE);

                    for (let i = 0; i < partcipatedUser.length; i++) {
                        partcipatedUser[i].RANK = i + 1;
                    }

                    console.log(`PARTICIPATED_USERS :  ${JSON.stringify(infoRound)}`);
                    if (isNextRound) {
                        let updated = await updateAndReturnById(ID, {
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
                        let cardDistributedLength = filterUser.findIndex((data: any) => data.USER_ID == minTotalObj.USER_ID);
                        const cardDistributedPlayer = (cardDistributedLength - 1 + filterUser.length) % filterUser.length;
                        // Next Round - Increment Round And Round Winner ID
                        io.of('/club-play').in(ID).emit('res:show-club-play', {
                            status: true,
                            show_In_ClubPlay: {
                                ALL_USERS_TOTAL: showResultCard,
                                NEXT_ROUND_USERS: filterUser,
                                WIN_USER: minTotalObj.USER_ID,
                                DISTRIBUTED_CARD_PLAYER: filterUser[cardDistributedPlayer]?.USER_ID,
                                IS_GAME_OVER: !isNextRound,
                                SHOW_USER_ID: isAuthorized?.ID,
                                ROUND_INFO: infoRound,
                                IN_HAND_CARD: inHandCard
                            }
                        })
                    } else {
                        let updated = await updateAndReturnById(ID, {
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
                        const input = typeof updated?.raw[0]?.ROUND_INFO === 'string' ? JSON.parse(updated?.raw[0]?.ROUND_INFO) : updated?.raw[0]?.ROUND_INFO;
                        console.log(`Input :::: ${JSON.stringify(input)}`)
                        const getLastRoundScores = {}; // Store the last round scores and ranks for each user
                        const allUsers = {};
                        const output = input.map((roundData: any) => {
                            console.log(`Data :::: ${JSON.stringify(roundData)}`)
                            
                            const partcipatedUser = typeof roundData?.PARTICIPATED_USERS === 'string' ? JSON.parse(roundData?.PARTICIPATED_USERS) : roundData?.PARTICIPATED_USERS;
                            console.log(`Data :::: ${partcipatedUser}`)
                            partcipatedUser?.forEach(user => {
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
                                    USER_LIST: partcipatedUser?.map(user => {
                                        return {
                                            ROUND: roundData.ROUND_NO,
                                            RANK: user.RANK,
                                            SCORE: user.SCORE,
                                            USER_ID: user.USER_ID
                                        };
                                    }
                                    )
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
                                SHOW_USER_ID: isAuthorized?.ID,
                                ROUND_INFO: infoRound,
                                IN_HAND_CARD: inHandCard,
                                RANK_SCORE_PER_ROUND: output
                            }
                        })
                    }
                }
            }
        }
    } catch (error) {
        socket.emit('res:error-message', { status: false, message: error?.message ?? "Unknown Error." });
    }
}

export { showCardClubPlay };