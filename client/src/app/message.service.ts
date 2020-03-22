import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Message } from './message/Message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private url = 'https://lovemu.compsoc.ie';
  private socket;  
  messages: Message[]; 

  constructor(public http: HttpClient) { 
    this.socket = io(this.url);
  }

  getMessages(id): Observable<Message[]> {
    return this.http.get<Message[]>('https://lovemu.compsoc.ie/messages/retrieve/' + id);
  }

  sendMessage(userData) {
    //this.socket.emit('message', message);
    this.http.post('https://lovemu.compsoc.ie/messages/send', userData).subscribe((res => {
      console.log('Req Made');
    }));
  }

  public getNewMessages = () => {
    return Observable.create((observer) => {
        this.socket.on('message', (message) => {
            observer.next(message);
        });
    });
  }
}
