import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { environment } from '../../environment/environment';
import { spotifyClient } from '../../environment/spotify';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private api_!: SpotifyApi;

  public get api(): SpotifyApi {
    if (!this.api_) {
      this.initApi();
    }
    return this.api_;
  }

  constructor(private router: Router) {}

  public initApi() {
    if (this.api_) {
      return;
    }

    this.api_ = SpotifyApi.withUserAuthorization(
      spotifyClient.clientId,
      environment.appUrl,
      [
        'user-read-playback-state',
        'user-modify-playback-state',
        'streaming',
        'user-read-email',
        'user-read-private',
      ]
    );
  }

  public connect() {
    this.api_.authenticate();
  }

  public logOut() {
    this.api_.logOut();
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
