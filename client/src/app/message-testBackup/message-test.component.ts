import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Message } from '../message/Message';
import { Messages } from './Messages';
import { MessageTest } from './MessageTest';
import { User } from '../users/User';
import { UsersService } from '../users.service';
import { ActivatedRoute } from '@angular/router';
import { Chatroom } from '../message/Chatroom';

@Component({
  selector: 'app-message-test',
  templateUrl: './message-test.component.html',
  styleUrls: ['./message-test.component.css']
})
export class MessageTestComponent implements OnInit {
  // Conversion
  currentUser: User;
  selectedUser: User;
  messages: Message[];

  // Send Info
  messageForm;
  message: string;

  chatrooms: Chatroom[] = [];
  user: User;

  constructor(public messageService: MessageService, private formBuilder: FormBuilder, private userService: UsersService, private route: ActivatedRoute) {
    this.messageForm = this.formBuilder.group({
      recipient: '',
      body: ''
    });
  }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getInitChatrooms();
  }

  setSelectedUser(user) {
    this.selectedUser = user;
    this.getMessages(user);
  }

  getMessages(user) {
    this.messageService.getMessages(user._id.toString()).subscribe(messages => this.messages = messages);
  }

  getInitChatrooms() {
    this.messageService.getInitChatrooms().subscribe(chatrooms => {
      this.chatrooms = chatrooms;
      this.chatrooms.forEach((e) => {
        e.members.forEach((m) => {
          if (m != this.userService.getCurrentUser().toString()) {
            this.userService.getUser(m.toString()).subscribe(user => {
              e.user = user;
            });
          }
        });
      });
    });
  }

  getUser(id) {
    this.userService.getUser(id.toString()).subscribe(user => {
      this.user = user;
    });
  }

  getCurrentUser() {
    this.userService.getUser(this.userService.getCurrentUser().toString()).subscribe(user => {
      this.currentUser = user;
    });
  }

  /*ngOnInit(): void {
    this.getCurrentUser();
    this.getUser();
  }

  getCurrentUser() {
    this.userService.getUser(this.userService.getCurrentUser().toString()).subscribe(user => {
      this.currentUser = user;
    });
  }

  getInitConvos() {
    this.messageService.getConvos().subscribe(convosIds => {
      convosIds.forEach(userId => {
        this.userService.getUser(userId.toString()).subscribe(user => {
          convos.forEach(convo => {
            if (convo.user.id == userId) {
              
            } else {
              let c = new Convo();
              c.members.push(user);
              this.messageService.getMessages(e.toString()).subscribe(messages => {
                c.messages.push(message);
              });
            }
          });
        });
      });
    });
  }
    /*this.messageService.getConvos().subscribe(convosIds => {
      convosIds.forEach(e => {
        this.userService.getUser(e.toString()).subscribe(user => {
          this.messageService.getMessages(e.toString()).subscribe(messages => {
            let convo = new Convo();
            convo.user = user;
            convo.messages = messages;
            console.log(convo);
            this.convos.push(convo);
          });
        });
      });
    });
  }*/

  sendMessage() {
    this.messageService.sendMessage(this.message);
    this.message = '';
  }

  onSubmit(userData) {
    userData.recipient = this.selectedUser._id;
    this.messageService.sendMessage(userData);
  } 
}
