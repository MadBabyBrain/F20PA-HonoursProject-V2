import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { io, Socket as cSocket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketManagerService {

  private chatSocket: cSocket;

  constructor(private socket: Socket) {
    this.chatSocket = io("http://localhost:5005");
  }

  emitEvent(bot: boolean, name: string, payload: any) {
    if (bot) {
      this.chatSocket.emit(name, { "message": payload });
    } else {
      this.socket.emit(name, payload);
    }
  }

  subscribeToEvent(bot: boolean, name: string, func: (...args: any) => void) {
    if (bot) {
      this.chatSocket.on(name, func);
    } else {
      this.socket.on(name, func);
    }
  }
}
