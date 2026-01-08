import { Socket, Namespace } from 'socket.io';
import { onlineUser } from './main/online';
import { disconnect } from './main/disconnect';

export function setupMainNamespace(io: any, namespace: Namespace) {

    namespace.on('connection', (socket: Socket) => {

        console.log(`A client connected to namespace: ${namespace.name}`);
        console.log(`A client connected to Socket Id : ${socket.id}`);

        // Event handlers specific to this namespace
        socket.on('req:online', (data: any) => onlineUser(socket, data));

        // disconnect method
        socket.on('disconnect', () => disconnect(io, socket));
    });
}