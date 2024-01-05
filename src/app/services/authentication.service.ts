import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { environment } from '../../environment/environment';
import { spotifyClient } from '../../environment/spotify';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private api!: SpotifyApi;

  constructor(private router: Router) {}

  public initApi() {
    if (this.api) {
      return;
    }

    this.api = SpotifyApi.withUserAuthorization(
      spotifyClient.clientId,
      environment.appUrl,
      ['user-read-playback-state', 'user-modify-playback-state']
    );
  }

  public connect() {
    this.api.authenticate();
  }

  public logOut() {
    this.api.logOut();
    localStorage.removeItem('spotify-sdk:verifier');
    this.router.navigateByUrl('home');
  }

  public isConnected(): boolean {
    return (
      localStorage.getItem(
        'spotify-sdk:AuthorizationCodeWithPKCEStrategy:token'
      ) !== null
    );
  }

  public hasVerifier(): boolean {
    return localStorage.getItem('spotify-sdk:verifier') !== null;
  }
}
