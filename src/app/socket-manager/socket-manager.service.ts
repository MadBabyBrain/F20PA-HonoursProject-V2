import { Injectable, Inject } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { io, Socket as cSocket } from 'socket.io-client';
import { chatSocket } from '../app.module';
import { webSocket } from '../app.module';

@Injectable({
  providedIn: 'root'
})
export class SocketManagerService {

  private chatSocket: chatSocket;
  private webSocket: webSocket;

  constructor(private ws: webSocket, private cs: chatSocket) {
    this.chatSocket = cs;
    this.webSocket = ws;


    // this.chatSocket = io("http://localhost:5001");
    // this.chatSocket = io("https://baf4-2-103-134-242.eu.ngrok.io");
    // this.chatSocket = io("https://public-insects-marry-80-43-50-235.loca.lt:5001");
    // this.webSocket = io("https://localhost:3000");
    // this.webSocket = io("https://bcbeeae2df61538b2d63dd86e36933c9.loca.lt:3000");
    // this.webSocket = io("192.168.1.9:3000");
    // this.webSocket = socket;
  }

  emitEvent(bot: boolean, name: string, payload: any) {
    if (bot) {
      this.chatSocket.emit(name, { "message": payload });
    } else {
      this.webSocket.emit(name, payload);
    }
  }

  subscribeToEvent(bot: boolean, name: string, func: (...args: any) => void) {
    if (bot) {
      this.chatSocket.on(name, func);
    } else {
      this.webSocket.on(name, func);
    }
  }
}
