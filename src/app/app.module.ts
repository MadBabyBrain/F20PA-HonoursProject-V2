import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatLayoutComponent } from './chat-layout/chat-layout.component';

import { Socket } from 'ngx-socket-io';

@Injectable()
export class webSocket extends Socket {
  constructor() {
    // super({url: 'https://f20pa-honours-project-1.herokuapp.com', options: {}})
    // super({ url: 'https://server-1.dgcapper.com', options: {}})
    // super({url: 'http://2.103.134.80:3001', options: {}})
    super({url: 'https://localhost:3001', options: {}})
  }
}

@Injectable()
export class chatSocket extends Socket {
  constructor() {
    // super({url: 'https://rasa-probability-bot.herokuapp.com', options: {}})
    // super({url: 'http://2.103.134.80:5000', options: {}})
    // super({ url: 'https://server-1.dgcapper.com', options: {}})
    super({url: 'http://localhost:5000', options: {}})
  }
}
@NgModule({
  declarations: [
    AppComponent,
    ChatLayoutComponent
  ],
  imports: [
    // SocketIoModule.forRoot(config),
    BrowserModule,
    AppRoutingModule
  ],
  providers: [webSocket, chatSocket],
  bootstrap: [AppComponent]
})
export class AppModule { }
