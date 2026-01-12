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
exports.setupSocket = void 0;
const socket_io_1 = require("socket.io");
const club_play_router_1 = require("src/socket/club-play.router");
const main_router_1 = require("src/socket/main.router");
function setupSocket(app) {
    return __awaiter(this, void 0, void 0, function* () {
        const io = new socket_io_1.Server(app, {
            transports: ['websocket'],
            allowEIO3: true
        });
        // Main Connection
        const mainNamespace = io.of("/");
        (0, main_router_1.setupMainNamespace)(io, mainNamespace);
        // Club Play
        const clubPlayNamespace = io.of('/club-play');
        (0, club_play_router_1.setupClubNamespace)(io, clubPlayNamespace);
        return io;
    });
}
exports.setupSocket = setupSocket;
//# sourceMappingURL=socket-config.js.map