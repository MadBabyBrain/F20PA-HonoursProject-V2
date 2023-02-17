"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSocket = void 0;
const crud_template_1 = require("./crud-template");
const event_types_1 = require("./event-types");
const path_1 = require("path");
const fs = __importStar(require("fs"));
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
        this.botListenBad(socket);
        this.botListenGood(socket);
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
    botListenGood(socket) {
        socket.on('good-reply', (o) => {
            let json = fs.readFileSync((0, path_1.resolve)('./Server/words.json'), 'utf-8');
            let d = JSON.parse(json);
            // increase probability of returning this reply and decrease the probability of returning others
            // increase by 1 / number of possibilities and decrease others by 1 / number of possibilities split between them
            let sentences = d[o.t]["sentences"];
            let tooSmall = false;
            let minVal = 1;
            sentences.forEach((obj) => {
                if (obj.text == o.s) {
                    obj.probability += 0.05;
                }
                else {
                    obj.probability -= 0.05 / (sentences.length - 1);
                    tooSmall = obj.probability < 0;
                    if (obj.probability < minVal) {
                        minVal = obj.probability;
                    }
                }
            });
            if (tooSmall) {
                let diff = 0 - minVal;
                sentences.forEach((obj) => obj.probability += diff);
            }
            let sum = 0;
            sentences.forEach((obj) => sum += obj.probability);
            let ratio = 1 / sum;
            sentences.forEach((obj) => obj.probability *= ratio);
            d[o.t]["sentences"] = sentences;
            fs.writeFileSync((0, path_1.resolve)("./Server/words.json"), JSON.stringify(d));
        });
    }
    botListenBad(socket) {
        socket.on('bad-reply', (o) => {
            let json = fs.readFileSync((0, path_1.resolve)('./Server/words.json'), 'utf-8');
            let d = JSON.parse(json);
            // increase probability of returning this reply and decrease the probability of returning others
            // increase by 1 / number of possibilities and decrease others by 1 / number of possibilities split between them
            let sentences = d[o.t]["sentences"];
            // let tooBig = false;
            // let maxVal = 0;
            let tooSmall = false;
            let minVal = 1;
            sentences.forEach((obj) => {
                if (obj.text == o.s) {
                    obj.probability -= 0.05;
                    tooSmall = obj.probability < 0;
                    if (obj.probability < minVal) {
                        minVal = obj.probability;
                    }
                }
                else {
                    obj.probability += 0.05 / (sentences.length - 1);
                    // tooBig = obj.probability > 1;
                    // if (obj.probability > maxVal) {
                    //     maxVal = obj.probability
                    // }
                }
            });
            // if (tooBig) {
            //     let diff = 1 - maxVal;
            //     sentences.forEach((obj) => obj.probability -= diff);
            // }
            if (tooSmall) {
                let diff = 0 - minVal;
                sentences.forEach((obj) => obj.probability += diff);
            }
            let sum = 0;
            sentences.forEach((obj) => sum += obj.probability);
            let ratio = 1 / sum;
            sentences.forEach((obj) => obj.probability *= ratio);
            d[o.t]["sentences"] = sentences;
            fs.writeFileSync((0, path_1.resolve)("./Server/words.json"), JSON.stringify(d));
        });
    }
}
exports.MessageSocket = MessageSocket;
