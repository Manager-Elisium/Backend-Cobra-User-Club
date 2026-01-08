
import { Server } from 'socket.io';
import { setupClubNamespace } from 'src/socket/club-play.router';
import { setupMainNamespace } from 'src/socket/main.router';


export async function setupSocket(app: any): Promise<any> {
    
    const io = new Server(app, {
        transports: ['websocket'],
        allowEIO3: true
    });
    // Main Connection
    const mainNamespace = io.of("/");
    setupMainNamespace(io, mainNamespace);

    // Club Play
    const clubPlayNamespace = io.of('/club-play');
    setupClubNamespace(io, clubPlayNamespace);

    return io;
}