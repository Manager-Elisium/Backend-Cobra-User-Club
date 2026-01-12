"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupMainNamespace = void 0;
const online_1 = require("./main/online");
const disconnect_1 = require("./main/disconnect");
function setupMainNamespace(io, namespace) {
    namespace.on('connection', (socket) => {
        console.log(`A client connected to namespace: ${namespace.name}`);
        console.log(`A client connected to Socket Id : ${socket.id}`);
        // Event handlers specific to this namespace
        socket.on('req:online', (data) => (0, online_1.onlineUser)(socket, data));
        // disconnect method
        socket.on('disconnect', () => (0, disconnect_1.disconnect)(io, socket));
    });
}
exports.setupMainNamespace = setupMainNamespace;
//# sourceMappingURL=main.router.js.map