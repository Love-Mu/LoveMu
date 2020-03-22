import { Component } from '@angular/core';
import { MessageService } from './message.service';

import { AuthenticationService } from './authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'LoveMu';

  constructor (private messageService: MessageService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.authService.isAuthenticated();
  }
}
