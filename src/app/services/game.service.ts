import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { ConfigurationService } from './configuration.service';
import { Episode, Page, PlaylistedTrack, Track } from '@spotify/web-api-ts-sdk';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private playlistItems!: Track[];
  private queue!: Track[];
  private currentPlayingSongIndex!: number;

  constructor(
    private authenticationService: AuthenticationService,
    private configurationService: ConfigurationService
  ) {}

  public async initGame(): Promise<void> {
    this.playlistItems = [];
    this.queue = [];
    this.currentPlayingSongIndex = -1;
    this.initDevice();
    return this.createQueue();
  }

  public initDevice() {
    this.authenticationService.api.player
      .transferPlayback([this.configurationService.getConfiguration().deviceId])
      .then(() => {
        this.authenticationService.api.player.pausePlayback(
          this.configurationService.getConfiguration().deviceId
        );
        this.authenticationService.api.player.setPlaybackVolume(
          50,
          this.configurationService.getConfiguration().deviceId
        );
      });
  }

  public async createQueue(): Promise<void> {
    return this.getPlaylistItems(0).then(() => {
      for (
        let i = 0;
        i < this.configurationService.getConfiguration().numberOfTracks;
        i++
      ) {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * this.playlistItems.length);
        } while (this.queue.includes(this.playlistItems[randomIndex]));
        this.queue.push(this.playlistItems[randomIndex]);
      }
    });
  }

  private async getPlaylistItems(offset: number): Promise<void> {
    return this.authenticationService.api.playlists
      .getPlaylistItems(
        this.configurationService.getConfiguration().playlistId,
        undefined,
        undefined,
        undefined,
        offset
      )
      .then((res: Page<PlaylistedTrack>) => {
        const items = res.items.map(
          (item: PlaylistedTrack) => item.track as Track
        );
        this.playlistItems = this.playlistItems.concat(items);
        if (!res.next) {
          return;
        }
        return this.getPlaylistItems(res.limit);
      });
  }

  public async playNextSong(): Promise<void> {
    this.currentPlayingSongIndex++;
    return this.authenticationService.api.player
      .addItemToPlaybackQueue(
        this.queue[this.currentPlayingSongIndex].uri,
        this.configurationService.getConfiguration().deviceId
      )
      .then(() => {
        this.authenticationService.api.player.setPlaybackVolume(0).then(() => {
          this.authenticationService.api.player
            .skipToNext(this.configurationService.getConfiguration().deviceId)
            .then(() => {
              this.pausePlayer();
              const randomPos: number = Math.floor(
                Math.random() *
                  (this.queue[this.currentPlayingSongIndex].duration_ms -
                    this.configurationService.getConfiguration().guessDuration *
                      1000 -
                    5000)
              );
              this.authenticationService.api.player
                .seekToPosition(
                  randomPos,
                  this.configurationService.getConfiguration().deviceId
                )
                .then(() => {
                  this.authenticationService.api.player
                    .setPlaybackVolume(50)
                    .then(() => {
                      this.authenticationService.api.player
                        .startResumePlayback(
                          this.configurationService.getConfiguration().deviceId
                        )
                        .then(() => {
                          return;
                        });
                    });
                });
            });
        });
      });
  }

  public pausePlayer() {
    this.authenticationService.api.player.pausePlayback(
      this.configurationService.getConfiguration().deviceId
    );
  }

  public getCurrentTrack(): Track {
    return this.queue[this.currentPlayingSongIndex];
  }
}
