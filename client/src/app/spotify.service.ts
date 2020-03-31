import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  constructor(private router: Router, private http: HttpClient) { }

  public handleSpotify() {
    const url = window.location.href;
    const queryParams = url.substring(26);
    if (queryParams.length > 0) {
      const tempArr = queryParams.split('=');
      if (tempArr[0] === '?spotify_token') {
        const spotifyToken = tempArr[1];
        console.log(spotifyToken)
        return this.http.post('https://lovemu.compsoc.ie/spotify/retrieveDetails', {access_token: spotifyToken}).subscribe();
      }
    }
  }
}
