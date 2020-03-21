import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-message-test',
  templateUrl: './message-test.component.html',
  styleUrls: ['./message-test.component.css']
})
export class MessageTestComponent implements OnInit {
  message: string;
  messages: string[] = [];
  messageForm;
  //retrieveForm;

  constructor(public messageService: MessageService, private formBuilder: FormBuilder) {
    this.messageForm = this.formBuilder.group({
      recipient: '',
      body: ''
    });
    /*this.retrieveForm = this.formBuilder.group({
      recipient: ''
    });*/
  }

  ngOnInit(): void {
    /*this.messageService
      .getMessages()
      .subscribe((message: string) => {
        this.messages.push(message);
      });*/
  }

  sendMessage() {
    this.messageService.sendMessage(this.message);
    this.message = '';
  }

  onSubmit(userData) {
    this.messageService.sendMessage(userData);
  } 
}
