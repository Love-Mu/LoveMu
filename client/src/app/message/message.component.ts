import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../users/User';
import { UsersService } from '../users.service';
import { MessageService } from '../message.service';
import { FormBuilder } from '@angular/forms';
import { Chatroom } from './Chatroom'
import { Message } from '../message/Message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  activeUser: User;
  activeChatroom: Chatroom;
  user: User;
  messageForm;
  chatrooms: Chatroom[] = [];
  messages: Message[] = [];

  constructor(private formBuilder: FormBuilder, public messageService: MessageService, private userService: UsersService, private route: ActivatedRoute) {
    this.messageForm = this.formBuilder.group({
      recipient: '',
      body: ''
    });
  }

  ngOnInit(): void {
    this.getUser();
    let id = this.route.snapshot.paramMap.get('id');
    if (id != null) this.getActiveUser(id);
    this.messageService.onNewMessage().subscribe(data => {
      let msg = new Message();
      msg = {
        _id: data._id, 
        sender: data.sender, 
        recipient: data.recipient, 
        body: data.body, 
        created_at: data.created_at
      };
      this.chatrooms.forEach(chatroom => {
        if (chatroom._id == data.chatroomId) chatroom.messages.push(msg);
      });
      if (this.activeChatroom != null) {
        if (data._id == this.activeChatroom._id) {
          this.activeChatroom.messages.push(msg);
        }
      }
      console.log(data);
      console.log(msg);
    });
  }

  changeActive(chatroom): void {
    this.activeChatroom = chatroom;
    chatroom.members.forEach(member => {
      if (member != this.user._id) {
        this.userService.getUser(member.toString()).subscribe((user) => {
          this.activeUser = user;
        });
      }
    });
    this.getMessages(this.activeUser._id, chatroom);
  }

  getMessages(id, chatroom) {
    this.messageService.getMessages(id.toString()).subscribe(messages => {
      messages.forEach(message => {
        chatroom.messages.push(message);
        this.messages.push(message);
      });
    });
  }

  checkActiveClass(id): boolean {
    if (id == this.route.snapshot.paramMap.get('id')) {
      return true;
    } else if (this.activeUser != null && this.activeUser._id.toString() == id) {
      return true;
    } else {
      return false;
    }
  }

  getInitChatrooms() {
    this.messageService.getInitChatrooms().subscribe(chatrooms => {
      this.chatrooms = chatrooms;
      this.chatrooms.forEach((e) => {
        e.members.forEach((m) => {
          if (m != this.user._id.toString()) {
            this.userService.getUser(m.toString()).subscribe(user => {
              e.user = user;
            });
          }
        });
      });
    });
  }

  getActiveUser(id): void {
    this.userService.getUser(id.toString()).subscribe((user) => {
      this.activeUser = user;
      //this.getMessages(user._id);
    });
  }

  getUser(): void {
    let id = this.userService.getCurrentUser();
    this.userService.getUser(id.toString()).subscribe((user) => {
      this.user = user;
      this.getInitChatrooms();
    });
  } 

  onSubmit(userData) {
    userData.sender = this.user._id;
    userData.recipient = this.activeUser._id;
    this.messageService.sendMessage(userData);
  } 
}
