import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private client: Client;
  private rentSubject = new Subject<any>();
  private returnSubject = new Subject<any>();

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {},
      debug: (msg: string) => {
        console.log('STOMP debug: ' + msg);
      },
      reconnectDelay: 5000,
    });

    this.client.onConnect = (frame) => {

      // Debug
      console.log('Connected: ' + frame);

      this.client.subscribe('/topic/rent', (message: IMessage) => {
        this.rentSubject.next(message.body);
      });

      this.client.subscribe('/topic/return', (message: IMessage) => {
        this.returnSubject.next(message.body);
      });
    };

    this.client.onStompError = (frame) => {
      console.error('STOMP Error:', frame);
    };

    this.client.activate();
  }

  getRentUpdates() {
    return this.rentSubject.asObservable();
  }

  getReturnUpdates() {
    return this.returnSubject.asObservable();
  }

  sendMessage(destination: string, message: string) {
    if (this.client.connected) {
      this.client.publish({ destination, body: message });
    } else {
      console.error('STOMP client not connected');
    }
  }

  disconnect() {
    this.client.deactivate();
  }
}
