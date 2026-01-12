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
exports.startTimerClubPlay = void 0;
const auth_token_1 = require("src/api/middleware/auth.token");
const club_play_repository_1 = require("src/repository/club-play.repository");
const club_table_repository_1 = require("src/repository/club-table.repository");
function startTimerClubPlay(io, socket, data) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("***********************");
            console.log(JSON.parse(data));
            console.log("***********************");
            const { Authtoken: token, TABLE_ID, CLUB_ID, USER_CLUB_ID } = JSON.parse(data);
            // Add
            if (!token) {
                socket.emit('res:unauthorized', { message: 'You are not authorized to perform this action.' });
            }
            else {
                const isAuthorized = yield (0, auth_token_1.verifyAccessToken)(token);
                if (!isAuthorized) {
                    socket.emit('res:unauthorized', { message: 'You are not authorized to perform this action.' });
                }
                else {
                    const findTable = yield (0, club_table_repository_1.getOneTable)({ where: { ID: TABLE_ID } });
                    if (!!findTable) {
                        if ((findTable === null || findTable === void 0 ? void 0 : findTable.JOINT_PLAYER) < (findTable === null || findTable === void 0 ? void 0 : findTable.NO_OF_PLAYER)) {
                            if ((findTable === null || findTable === void 0 ? void 0 : findTable.JOINT_PLAYER) + 1 === (findTable === null || findTable === void 0 ? void 0 : findTable.NO_OF_PLAYER)) {
                                // TODO ::: Create New Record in table and clear after game finish
                                const currentJoint = (_a = findTable === null || findTable === void 0 ? void 0 : findTable.JOINT_TABLE_CLUB_USER) !== null && _a !== void 0 ? _a : [];
                                currentJoint.push({
                                    CONNECTION_ID: socket.id,
                                    USER_ID: isAuthorized === null || isAuthorized === void 0 ? void 0 : isAuthorized.ID,
                                    USER_CLUB_ID,
                                    IS_JOINT_ROOM: false,
                                    IS_LEAVE_ROOM: false,
                                    TOTAL: 0,
                                    ROUNDS: [0],
                                    CURRENT_TOTAL: 0,
                                    CARD_LENGTH: 0,
                                    IS_PENALTY_SCORE: false,
                                    PENALTY_COUNT: 0
                                });
                                let updateUser = yield (0, club_table_repository_1.updateAndReturnByIdTable)(findTable === null || findTable === void 0 ? void 0 : findTable.ID, {
                                    JOINT_PLAYER: (findTable === null || findTable === void 0 ? void 0 : findTable.JOINT_PLAYER) + 1,
                                    JOINT_TABLE_CLUB_USER: currentJoint,
                                    IN_RUNNING_TABLE: true
                                });
                                let getDetail = yield (0, club_table_repository_1.getUserAndClubById)(TABLE_ID);
                                let createRoom = yield (0, club_play_repository_1.createClubPlay)({
                                    USERS: getDetail.JOINT_TABLE_CLUB_USER,
                                    TABLE_ID: TABLE_ID
                                });
                                for (let index = 0; index < createRoom.USERS.length; index++) {
                                    io.of('/club-play').to(createRoom.USERS[index].CONNECTION_ID)
                                        .emit('res:create-room-name-for-table', {
                                        status: true,
                                        createRoom_In_ClubPlay: {
                                            USERS: createRoom.USERS,
                                            CLUB_ROOM_NAME: createRoom.ID
                                        }
                                    });
                                }
                            }
                            else {
                                socket.emit("res:wait-club-play", {
                                    status: true,
                                    message: "Waiting to other player..."
                                });
                                const currentJoint = (_b = findTable === null || findTable === void 0 ? void 0 : findTable.JOINT_TABLE_CLUB_USER) !== null && _b !== void 0 ? _b : [];
                                currentJoint.push({
                                    CONNECTION_ID: socket.id,
                                    USER_ID: token === null || token === void 0 ? void 0 : token.ID,
                                    USER_CLUB_ID,
                                    IS_JOINT_ROOM: false,
                                    IS_LEAVE_ROOM: false,
                                    TOTAL: 0,
                                    ROUNDS: [0],
                                    CURRENT_TOTAL: 0,
                                    CARD_LENGTH: 0,
                                    IS_PENALTY_SCORE: false,
                                    PENALTY_COUNT: 0
                                });
                                let updateUser = yield (0, club_table_repository_1.updateAndReturnByIdTable)(findTable === null || findTable === void 0 ? void 0 : findTable.ID, {
                                    JOINT_PLAYER: (findTable === null || findTable === void 0 ? void 0 : findTable.JOINT_PLAYER) + 1,
                                    JOINT_TABLE_CLUB_USER: currentJoint,
                                    IN_RUNNING_TABLE: true
                                });
                            }
                        }
                        else {
                            socket.emit('res:error-message', { status: false, message: "Table is full. Please try another table." });
                        }
                    }
                    else {
                        socket.emit('res:error-message', { status: false, message: "Table is not found." });
                    }
                }
            }
        }
        catch (error) {
            console.log(JSON.stringify(error));
            socket.emit('res:error-message', { status: false, message: (_c = error === null || error === void 0 ? void 0 : error.message) !== null && _c !== void 0 ? _c : "Unknown Error." });
        }
    });
}
exports.startTimerClubPlay = startTimerClubPlay;
//# sourceMappingURL=start-timer.js.map