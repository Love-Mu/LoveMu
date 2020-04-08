import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../users/User';
import { UsersService } from '../users.service';
import { MessageService } from '../message.service';
import { FormBuilder } from '@angular/forms';
import { Chatroom } from './Chatroom'
import { Message } from '../message/Message';
import { DOCUMENT } from '@angular/common'
import { WINDOW } from "../window.service";

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
  online: String[] = [];
  public isMobileLayout = false;
  public isMenuOpen = true;

  constructor(@Inject(DOCUMENT) private document: Document, @Inject(WINDOW) private window: Window, private formBuilder: FormBuilder, public messageService: MessageService, private userService: UsersService, private route: ActivatedRoute) {
    this.messageForm = this.formBuilder.group({
      recipient: '',
      body: ''
    });
  }

  ngOnInit(): void {
    this.getUser();
    let id = this.route.snapshot.paramMap.get('id');
    if (id != null) this.getActiveUser(id);

    this.socketMessages();

    window.onresize = () => this.isMobileLayout = window.innerWidth <= 700;
  }

  @HostListener('scroll', ['$event'])
  scrollHandler(event){
    console.log(event.srcElement.scrollHeight);
    if (event.srcElement.scrollTop < 1) {
      console.log(event.srcElement);
      let bottom = event.srcElement.scrollHeight;
      console.log(bottom);
      this.getNextMessages(this.activeUser._id);
      //event.srcElement.scrollTop = bottom - 800;
    }
  }

  socketMessages() {
    // When a new message is recieved, whether it we our own sent back to us or another persons, its put into the respective chatroom in the array
    this.messageService.onNewMessage().subscribe(data => {
      let chatroom = this.chatrooms.find(x => x._id == data.chatroomId);
      let msg = {
        _id: data._id,
        sender: data.sender,
        recipient: data.recipient,
        body: data.body,
        created_at: data.created_at
      };

      // Checking if existing chatroom exists to push to, otherwise getting the chatroom by reiniting the chatroom array.
      if (chatroom == null || chatroom == undefined) {
        this.getInitChatrooms();
      } else {
        chatroom.messages.push(msg);
      }
    });

    // Removing Id from online list if they go offline
    this.messageService.onGoneOffline().subscribe(data => {
      this.online = this.online.filter(id => id !== data.id);
    });

    // Adding Id to online if they come online.
    this.messageService.onGoneOnline().subscribe(data => {
      let id = this.online.filter(x => x.includes(data.id));
      if (id == undefined || id.length == 0) {
        this.online.push(data.id);
      }
    });

    this.messageService.getInitOnline().subscribe(data => {
      data.forEach(e => {
        this.online.push(e.id);
      });
    });
  }

  changeActive(chatroom): void {
    this.activeChatroom = chatroom;
    this.activeUser = chatroom.user;
    this.getMessages(this.activeUser._id);
    console.log(this.activeChatroom);
  }

  getMessages(id) {
    this.messageService.getMessages(id).subscribe(messages => {
        messages.reverse();
        this.messages = messages;
        this.activeChatroom.messages = messages;
    })
  }

  getNextMessages(id) {
    this.messageService.getNextMessages(id, this.activeChatroom.messages.length).subscribe(messages => {
      messages.forEach(msg => {
        this.activeChatroom.messages.unshift(msg);
      });
    })
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
      this.getMessages(user._id);
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
    this.messageForm.clear;
    this.messageForm.body = '';
  }

  changeMenu(){
    this.isMenuOpen = !this.isMenuOpen;
}
}
