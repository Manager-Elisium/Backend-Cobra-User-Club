import { Socket, Namespace } from 'socket.io';
import { onlineClubPlay } from './club-play/online';
import { startTimerClubPlay } from './club-play/start-timer';
import { jointRoomTablePlay } from './club-play/joint-room';
import { decidedFirstRoundTurnTablePlay } from './club-play/decide-turn';
import { distributedCardTablePlay } from './club-play/distributed-card';
import { dropCardTablePlay } from './club-play/drop-card';
import { pickCardTablePlay } from './club-play/pick-card';
import { showCardClubPlay } from './club-play/show-card';


export function setupClubNamespace(io: any, namespace: Namespace) {

    namespace.on('connection', (socket: Socket) => {

        console.log(`A client connected to namespace: ${namespace.name}`);
        console.log(`A client connected to Socket Id : ${socket.id}`);

        // backgroud
        socket.on('req:online-club-play', (data: any) => onlineClubPlay(io, socket, data));

        // Event handlers specific to this namespace
        socket.on('req:start-timer-club-play', (data: any) => startTimerClubPlay(io, socket, data));
        socket.on('req:joint-room-in-table-play', (data: any) => jointRoomTablePlay(io, socket, data));

        // Common Event Handler
        socket.on('req:decided-first-round-turn-table-play', (data: any) => decidedFirstRoundTurnTablePlay(io, socket, data));
        socket.on('req:seven-card-distributed-table-play', (data: any) => distributedCardTablePlay(io, socket, data));
        socket.on('req:drop-card-table-play', (data: any) => dropCardTablePlay(io, socket, data));
        socket.on('req:pick-card-table-play', (data: any) => pickCardTablePlay(io, socket, data));
        socket.on('req:show-club-play', (data: any) => showCardClubPlay(io, socket, data));

    });
}