import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private url = 'https://lovemu.compsoc.ie';
  private socket;   

  constructor(public http: HttpClient) { 
    this.socket = io(this.url);
    
  }

  public sendMessage(userData) {
    //this.socket.emit('message', message);
    this.http.post('https://lovemu.compsoc.ie/messages/send', userData, {withCredentials: true}).subscribe((res => {
      console.log('Message Req Sent');
    }));
    /*this.http.post('https://lovemu.compsoc.ie/messages/retrieve', userData, {withCredentials: true}).subscribe((res => {
      console.log('Message Req Sent');
    }));*/
  }

  public getMessages = () => {
    return Observable.create((observer) => {
        this.socket.on('message', (message) => {
            observer.next(message);
        });
    });
  }
}
