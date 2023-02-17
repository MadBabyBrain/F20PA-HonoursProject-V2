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

        this.botListenBad(socket);
        this.botListenGood(socket);
    }

    itemExists(id: string) : boolean {
        throw new Error('Not implemented')
    }


    emitUpdate(options?: {socket?: Socket, id?: string}) {
        throw new Error('Not implemented')
    }


    create(socket: Socket) {
        socket.on(`create-${this.name}`, (data) => { // create item
            console.log(`sending message with msg: ${data}`)
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

    botListenGood(socket: Socket) {
        socket.on('good-reply', (o : {t: string, s: string}) => {
            let json: string = fs.readFileSync(resolve('./Server/words.json'), 'utf-8');
            let d = JSON.parse(json);
            
            // increase probability of returning this reply and decrease the probability of returning others
            // increase by 1 / number of possibilities and decrease others by 1 / number of possibilities split between them
            let sentences: Array<{probability: number, text: string }> = d[o.t]["sentences"]
            
            let tooSmall = false;
            let minVal = 1;

            sentences.forEach((obj) => {
                if (obj.text == o.s) {
                    obj.probability += 0.05;
                } else {
                    obj.probability -= 0.05 / (sentences.length - 1);
                    tooSmall = obj.probability < 0;
                    if (obj.probability < minVal) {
                        minVal = obj.probability
                    }
                }
            })

            if (tooSmall) {
                let diff = 0 - minVal;
                sentences.forEach((obj) => obj.probability += diff);
            }

            let sum = 0;
            sentences.forEach((obj) => sum += obj.probability)
            let ratio = 1 / sum;
            sentences.forEach((obj) => obj.probability *= ratio)
            
            d[o.t]["sentences"] = sentences;
            fs.writeFileSync(resolve("./Server/words.json"), JSON.stringify(d))
        })
    }

    botListenBad(socket: Socket) {
        socket.on('bad-reply', (o : {t: string, s: string}) => {
            let json: string = fs.readFileSync(resolve('./Server/words.json'), 'utf-8');
            let d = JSON.parse(json);
            
            // increase probability of returning this reply and decrease the probability of returning others
            // increase by 1 / number of possibilities and decrease others by 1 / number of possibilities split between them
            let sentences: Array<{probability: number, text: string }> = d[o.t]["sentences"]

            // let tooBig = false;
            // let maxVal = 0;

            let tooSmall = false;
            let minVal = 1;

            sentences.forEach((obj) => {
                if (obj.text == o.s) {
                    obj.probability -= 0.05;
                    tooSmall = obj.probability < 0;
                    if (obj.probability < minVal) {
                        minVal = obj.probability
                    }
                } else {
                    obj.probability += 0.05 / (sentences.length - 1);
                    // tooBig = obj.probability > 1;
                    // if (obj.probability > maxVal) {
                    //     maxVal = obj.probability
                    // }
                }
            })

            // if (tooBig) {
            //     let diff = 1 - maxVal;
            //     sentences.forEach((obj) => obj.probability -= diff);
            // }

            if (tooSmall) {
                let diff = 0 - minVal;
                sentences.forEach((obj) => obj.probability += diff);
            }

            let sum = 0;
            sentences.forEach((obj) => sum += obj.probability)
            let ratio = 1 / sum;
            sentences.forEach((obj) => obj.probability *= ratio)

            d[o.t]["sentences"] = sentences;
            fs.writeFileSync(resolve("./Server/words.json"), JSON.stringify(d))
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