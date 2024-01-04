import { Injectable } from '@angular/core';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { environment } from '../../environment/environment';
import { spotifyClient } from '../../environment/spotify';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private api!: SpotifyApi;

  public initApi() {
    if (this.api) {
      return;
    }
    this.api = SpotifyApi.withUserAuthorization(
      spotifyClient.clientId,
      environment.appUrl,
      ['user-read-playback-state', 'user-modify-playback-state']
    );

    this.api.authenticate();
  }

  public isConnected(): Promise<boolean> {
    this.initApi();
    return false;
  }

  public logOut() {
    this.api.logOut();
  }
}
