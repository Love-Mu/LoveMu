import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { SpotifyService } from '../spotify.service';
import { User } from './User';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[];
  breakpoint;

  constructor(private userService: UsersService, private spotifyService: SpotifyService) { }

  ngOnInit() {
    this.getUsers();
    this.breakpoint = (window.innerWidth <= 480) ? 1 : 6;
    this.spotifyService.refreshSpotify();
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 480) ? 1 : 6;
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(
      users => {
        this.users = users;//.sort((a, b) => (a.score >= b.score) ? -1 : 1);
        console.log(this.users);
      },
      error => console.log(error)
    );
  }
}
