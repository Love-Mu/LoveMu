import { Component } from '@angular/core';
import { MessageService } from './message.service';
import {Location} from '@angular/common';

import { AuthenticationService } from './authentication.service';
import { SpotifyService } from './spotify.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'LoveMu';

  constructor (private location: Location, private authService: AuthenticationService, private spotifyService: SpotifyService) { }

  ngOnInit() {
    this.authService.isAuthenticated();
    this.spotifyService.handleSpotify();
    this.authService.googleValidate();
  }

  cancel() {
    this.location.back();
  }

  backClicked() {
    this.location.back();
  }
}
