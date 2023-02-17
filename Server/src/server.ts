import { Server, Socket } from "socket.io";
import { MessageSocket } from "./message-socket";

var server = (io: Server) => {

    const ms = new MessageSocket(io)

    io.on('connection', (socket: Socket) => { // user connects
        console.log("User connected with id: " + socket.id)

        ms.setupEvents(socket);
        
        socket.on('disconnect', (reason) => {
            console.log("socket: " + socket.id + " has disconnected with reason: " + reason)
        })
    })
}

export { server }