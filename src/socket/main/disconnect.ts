import { Socket } from 'socket.io';


async function disconnect(io: any, socket: Socket) {
    try {
    
    } catch (error) {
        socket.emit('res:error-message', { status: false, message: error?.message ?? "Unknown Error." });
    }
}

export { disconnect };