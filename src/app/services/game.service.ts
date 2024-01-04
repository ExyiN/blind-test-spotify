import { Injectable } from '@angular/core';
import { Devices, PlaylistedTrack, SpotifyApi } from '@spotify/web-api-ts-sdk';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private api!: SpotifyApi;
  private config = {
    guessDuration: 30000,
  };
  private deviceId!: string;

  private initApi() {
    if (this.api) {
      return;
    }
    this.api = SpotifyApi.withUserAuthorization(
      environment.client_id,
      'http://localhost:4200',
      ['user-read-playback-state', 'user-modify-playback-state']
    );
  }

  public getPlaylistItems(playlistId: string) {
    this.initApi();
    return this.api.playlists.getPlaylistItems(playlistId);
  }

  public initPlayer() {
    this.api.player.getAvailableDevices().then((devices: Devices) => {
      this.deviceId = devices.devices[0].id!;
      this.api.player.transferPlayback([this.deviceId]);
      this.api.player.pausePlayback(this.deviceId);
      this.api.player.setPlaybackVolume(50);
    });
  }

  public saveConfig(guessDuration: number) {
    this.config = { guessDuration: guessDuration };
  }

  public createQueue(
    items: PlaylistedTrack[],
    numberOfTracks: number,
    queue: string[]
  ) {
    if (queue.length >= numberOfTracks) {
      return;
    }
    let trackToAdd: PlaylistedTrack;
    do {
      trackToAdd = items[Math.floor(Math.random() * items.length)];
    } while (queue.includes(trackToAdd.track.id));
    queue.push(trackToAdd.track.id);

    this.api.player.addItemToPlaybackQueue(trackToAdd.track.uri).then(() => {
      setTimeout(() => this.createQueue(items, numberOfTracks, queue), 200);
    });
  }

  public async startGame() {
    await this.api.player.skipToNext(this.deviceId);
    const track = await this.api.player.getCurrentlyPlayingTrack();
    // const randPos: number = Math.floor(Math.random() * tr);
    // await this.api.player.seekToPosition();
    // TODO : Add quand on start et next les musiques au lieu de tout au début je pense
  }
}
