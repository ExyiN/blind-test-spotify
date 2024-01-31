import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Page, PlaylistedTrack, Track } from '@spotify/web-api-ts-sdk';
import { AuthenticationService } from './authentication.service';
import { ConfigurationService } from './configuration.service';
import { LoaderService } from './loader.service';
import { TimerService } from './timer.service';
import { PlayerService } from './player.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private playlistItems!: Track[];
  private queue!: Track[];
  private currentPlayingSongIndex!: number;

  constructor(
    private authenticationService: AuthenticationService,
    private configurationService: ConfigurationService,
    private timer: TimerService,
    private router: Router,
    private loader: LoaderService,
    private playerService: PlayerService
  ) {}

  public async initGame(): Promise<void> {
    this.loader.setLoading(true);
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
          this.configurationService.getPlayerVolume(),
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

  public async playNextSong() {
    const deviceId = this.configurationService.getConfiguration().deviceId;
    this.loader.setLoading(true);
    this.currentPlayingSongIndex++;
    const randomPos: number = Math.floor(
      Math.random() *
        (this.queue[this.currentPlayingSongIndex].duration_ms -
          this.configurationService.getConfiguration().guessDuration * 1000 -
          5000)
    );
    this.authenticationService.api.player.setPlaybackVolume(1, deviceId);
    this.authenticationService.api.player
      .addItemToPlaybackQueue(
        this.queue[this.currentPlayingSongIndex].uri,
        deviceId
      )
      .then(() => {
        setTimeout(() => {
          this.authenticationService.api.player
            .skipToNext(deviceId)
            .then(() => {
              setTimeout(() => {
                this.authenticationService.api.player
                  .seekToPosition(randomPos, deviceId)
                  .then(() => {
                    this.authenticationService.api.player
                      .setPlaybackVolume(
                        this.configurationService.getPlayerVolume(),
                        deviceId
                      )
                      .then(() => {
                        this.loader.setLoading(false);
                        this.timer.start(
                          this.configurationService.getConfiguration()
                            .guessDuration
                        );
                      });
                  });
              }, 500);
            });
        }, 500);
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

  public getCurrentTrackIndex(): number {
    return this.currentPlayingSongIndex;
  }

  public modifyVolume(volume: number) {
    this.authenticationService.api.player.setPlaybackVolume(
      volume,
      this.configurationService.getConfiguration().deviceId
    );
  }

  public endGame() {
    this.router.navigateByUrl('end');
    this.configurationService.deleteConfiguration();
    this.playerService.disconnect();
  }
}
