import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SocketManagerService } from '../socket-manager/socket-manager.service';

@Component({
  selector: 'app-chat-layout',
  templateUrl: './chat-layout.component.html',
  styleUrls: ['./chat-layout.component.scss']
})
export class ChatLayoutComponent implements OnInit, AfterViewInit {

  messages: Array<{who: string, reply: string}> = new Array<{who: string, reply: string}>;

  constructor(private socketMan: SocketManagerService) { }

  ngAfterViewInit(): void {
    // this.socketMan.subscribeToEvent(false, 'recieve-message', (reply: String) => {
    //   console.log(reply.split(':=:'));
    // })
    this.socketMan.subscribeToEvent(true, 'bot_uttered', (reply: { text: string }) => {
      console.log(reply);
      this.messages.push({who: "bot", reply: reply.text});
    })
    let input_area = document.getElementById("input") as HTMLTextAreaElement;
    input_area.value = ""
  }

  ngOnInit(): void {
  }

  submit(): void {
    let input_area = document.getElementById("input") as HTMLTextAreaElement;
    let msg = input_area.value;

    this.messages.push({who:"user", reply: msg});

    this.socketMan.emitEvent(false, 'create-message', msg);
    this.socketMan.emitEvent(true, 'user_uttered', msg);
  }

  goodReview(topic:string, str: string): void {
    this.socketMan.emitEvent(false, 'good-reply', {t: topic, s: str});
  }

  badReview(topic:string, str: string): void {
    this.socketMan.emitEvent(false, 'bad-reply', {t: topic, s: str});
  }

}
