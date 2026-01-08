import { Socket } from "socket.io";
import { verifyAccessToken } from "src/api/middleware/auth.token";


async function onlineUser(socket: Socket, data: any) {
    try {
        const { Authtoken: token } = JSON.parse(data);
        if (!token) {
            socket.emit('res:unauthorized', { message: 'You are not authorized to perform this action.' });
        } else {
            const isAuthorized = await verifyAccessToken(token) as any;
            if (!isAuthorized) {
                socket.emit('res:unauthorized', { status: false, message: 'You are not authorized to perform this action.' });
            } else {
               
            }
        }
    } catch (error) {
        socket.emit('res:error-message', { status: false, message: error?.message ?? "Unknown Error." });
    }
}

export { onlineUser };