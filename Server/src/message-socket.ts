import { crudtemplate } from "./crud-template";
import { EventTypes } from "./event-types";
import { Server, Socket } from "socket.io"
import { resolve } from "path";
import * as fs from 'fs';

export class MessageSocket extends crudtemplate<{id: 'message'}> {


    constructor(io: Server) {
        super(io, EventTypes.Message);
    }

    setupEvents(socket: Socket) { // Setting up C, R, U, D listeners for suers socket
        this.create(socket); // create brand new item
        this.read(socket);   // returns all items
        this.update(socket); // updates item that already exists
        this.delete(socket); // delete item that exists
        // this.listen(socket);
    }
    
    itemExists(id: string) : boolean {
        throw new Error('Not implemented')
    }


    emitUpdate(options?: {socket?: Socket, id?: string}) {
        throw new Error('Not implemented')
    }


    create(socket: Socket) {
        socket.on(`create-${this.name}`, (data) => { // create item
            console.log(`${socket.id}: sending message with msg: ${data}`)
    })}

    read(socket: Socket) {
        socket.on(`get-all-${this.name}`, () => { // Read items
            this.emitUpdate();
        })
    }
    
    update(socket: Socket) {
        socket.on(`update-${this.name}`, (id : string) => { // Update item
            this.emitUpdate({socket, id});
        })
    }
    
    delete(socket: Socket) {
        socket.on(`delete-${this.name}`, (id: string) => { // Delete item
            if (!this.itemExists(id)) return;
            this.emitUpdate();
        })
    }


    // listen(socket: Socket) {
    //     console.log("listening for bot response")
    //     socket.on('bot_uttered', (response) => {
    //         console.log("Bot uttered:", response);
    //         socket.emit(`recieve-${this.name}`, response.text);
    //     });
    // }

}