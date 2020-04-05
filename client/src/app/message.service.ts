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
    this.http.post('https://lovemu.compsoc.ie/messages/send', userData).subscribe(res => {
      userData._id = res['_id'];
      userData.created_at = res['created_at'];
      userData.chatroomId = res['chatroomId'];
      this.socket.emit('dm', userData);
    });
  }

  playNotification() {
    let audio = new Audio();
    audio.src = "assets/notification.mp3";
    audio.load();
    audio.play();
  }

  onNewMessage() {
    return Observable.create((observer) => {
      this.socket.on('message', (data) => {
          if (data.sender != this.userService.getCurrentUser()) this.playNotification();
          observer.next(data);
      });
    });
  }

  getInitOnline() {
    return Observable.create((observer) => {
      this.socket.on('online', (data) => {
          observer.next(data);
      });
    });
  }
  
  onGoneOffline() {
    return Observable.create((observer) => {
      this.socket.on('goneOffline', (data) => {
          observer.next(data);
      });
    });
  }

  onGoneOnline() {
    return Observable.create((observer) => {
      this.socket.on('goneOnline', (data) => {
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

  getNextMessages(id, pos): Observable<Message[]> {
    return this.http.get<Message[]>('https://lovemu.compsoc.ie/messages/retrieveNext/'+id+'/'+pos);
  }
}
