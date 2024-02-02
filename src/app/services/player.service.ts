///  <reference types="@types/spotify-web-playback-sdk"/>
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { AccessToken } from '@spotify/web-api-ts-sdk';
import { ConfigurationService } from './configuration.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private spotifyPlayer!: Spotify.Player;
  private id$: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);

  public get player(): Spotify.Player {
    return this.spotifyPlayer;
  }

  public get deviceId(): Observable<string | null> {
    return this.id$.asObservable();
  }

  constructor(
    private authenticationService: AuthenticationService,
    private configurationService: ConfigurationService
  ) {}

  public createPlayer() {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.type = 'text/javascript';
    script.addEventListener('load', (e) => {
      console.log(e);
    });
    document.head.appendChild(script);

    this.authenticationService.api
      .getAccessToken()
      .then((accessToken: AccessToken | null) => {
        if (accessToken) {
          window.onSpotifyWebPlaybackSDKReady = () => {
            const token: string = accessToken.access_token;

            this.spotifyPlayer = new Spotify.Player({
              name: 'BlindTest Web Player',
              getOAuthToken: (cb) => cb(token),
              volume: +this.configurationService.getPlayerVolume(),
            });

            this.spotifyPlayer.addListener('ready', ({ device_id }) => {
              console.log('Ready with Device ID', device_id);
              this.id$.next(device_id);
            });

            this.spotifyPlayer.addListener('not_ready', ({ device_id }) => {
              console.log('Device ID has gone offline', device_id);
            });

            this.spotifyPlayer.addListener(
              'initialization_error',
              ({ message }) => {
                console.error(message);
              }
            );

            this.spotifyPlayer.addListener(
              'authentication_error',
              ({ message }) => {
                console.error(message);
              }
            );

            this.spotifyPlayer.addListener('account_error', ({ message }) => {
              console.error(message);
            });

            this.spotifyPlayer.connect();
          };
        }
      });
  }

  public disconnect() {
    this.spotifyPlayer.disconnect();
  }
}
