"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSocket = void 0;
const crud_template_1 = require("./crud-template");
const event_types_1 = require("./event-types");
class MessageSocket extends crud_template_1.crudtemplate {
    constructor(io) {
        super(io, event_types_1.EventTypes.Message);
    }
    setupEvents(socket) {
        this.create(socket); // create brand new item
        this.read(socket); // returns all items
        this.update(socket); // updates item that already exists
        this.delete(socket); // delete item that exists
        // this.listen(socket);
    }
    itemExists(id) {
        throw new Error('Not implemented');
    }
    emitUpdate(options) {
        throw new Error('Not implemented');
    }
    create(socket) {
        socket.on(`create-${this.name}`, (data) => {
            console.log(`sending message with msg: ${data}`);
        });
    }
    read(socket) {
        socket.on(`get-all-${this.name}`, () => {
            this.emitUpdate();
        });
    }
    update(socket) {
        socket.on(`update-${this.name}`, (id) => {
            this.emitUpdate({ socket, id });
        });
    }
    delete(socket) {
        socket.on(`delete-${this.name}`, (id) => {
            if (!this.itemExists(id))
                return;
            this.emitUpdate();
        });
    }
}
exports.MessageSocket = MessageSocket;
