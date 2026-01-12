"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupClubNamespace = void 0;
const online_1 = require("./club-play/online");
const start_timer_1 = require("./club-play/start-timer");
const joint_room_1 = require("./club-play/joint-room");
const decide_turn_1 = require("./club-play/decide-turn");
const distributed_card_1 = require("./club-play/distributed-card");
const drop_card_1 = require("./club-play/drop-card");
const pick_card_1 = require("./club-play/pick-card");
const show_card_1 = require("./club-play/show-card");
function setupClubNamespace(io, namespace) {
    namespace.on('connection', (socket) => {
        console.log(`A client connected to namespace: ${namespace.name}`);
        console.log(`A client connected to Socket Id : ${socket.id}`);
        // backgroud
        socket.on('req:online-club-play', (data) => (0, online_1.onlineClubPlay)(io, socket, data));
        // Event handlers specific to this namespace
        socket.on('req:start-timer-club-play', (data) => (0, start_timer_1.startTimerClubPlay)(io, socket, data));
        socket.on('req:joint-room-in-table-play', (data) => (0, joint_room_1.jointRoomTablePlay)(io, socket, data));
        // Common Event Handler
        socket.on('req:decided-first-round-turn-table-play', (data) => (0, decide_turn_1.decidedFirstRoundTurnTablePlay)(io, socket, data));
        socket.on('req:seven-card-distributed-table-play', (data) => (0, distributed_card_1.distributedCardTablePlay)(io, socket, data));
        socket.on('req:drop-card-table-play', (data) => (0, drop_card_1.dropCardTablePlay)(io, socket, data));
        socket.on('req:pick-card-table-play', (data) => (0, pick_card_1.pickCardTablePlay)(io, socket, data));
        socket.on('req:show-club-play', (data) => (0, show_card_1.showCardClubPlay)(io, socket, data));
    });
}
exports.setupClubNamespace = setupClubNamespace;
//# sourceMappingURL=club-play.router.js.map