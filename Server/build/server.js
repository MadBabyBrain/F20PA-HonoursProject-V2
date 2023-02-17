"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const message_socket_1 = require("./message-socket");
var server = (io) => {
    const ms = new message_socket_1.MessageSocket(io);
    io.on('connection', (socket) => {
        console.log("User connected with id: " + socket.id);
        ms.setupEvents(socket);
        socket.on('disconnect', (reason) => {
            console.log("socket: " + socket.id + " has disconnected with reason: " + reason);
        });
    });
};
exports.server = server;
