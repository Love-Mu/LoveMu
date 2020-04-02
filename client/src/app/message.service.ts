import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Message } from './message/Message';
import { Chatroom } from './message/Chatroom'
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private url = 'https://lovemu.compsoc.ie';
  private socket;  
  messages: Message[];

  constructor(private userService: UsersService, public http: HttpClient) { 
    this.socket = io(this.url, { query: { id: userService.getCurrentUser() }});
    this.socket.emit('message', 'Hello there from Angular.');
  }

  sendMessage(userData) {
    this.http.post('https://lovemu.compsoc.ie/messages/send', userData).subscribe((res => {
      userData._id = res['_id'];
      userData.created_at = res['created_at'];
      userData.chatroomId = res['chatroomId'];
      this.socket.emit('dm', userData);
    }));
  }

  onNewMessage() {
    return Observable.create((observer) => {
      this.socket.on('message', (data) => {
          observer.next(data);
      });
    });
  }

  getInitChatrooms(): Observable<Chatroom[]> {
    return this.http.get<Chatroom[]>('https://lovemu.compsoc.ie/messages/chatroom');
  }

  getMessages(id): Observable<Message[]> {
    return this.http.get<Message[]>('https://lovemu.compsoc.ie/messages/retrieve/'+id);
  }

  /*public getNewMessages = () => {
    return Observable.create((observer) => {
        this.socket.on('message', (message) => {
            observer.next(message);
        });
    });
  }*/
}
