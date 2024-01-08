import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { GameConfiguration } from '../interfaces/game-configuration';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  private configuration!: GameConfiguration;

  constructor(private authenticationService: AuthenticationService) {}

  public getConfiguration(): GameConfiguration {
    const cacheConfig: string | null = localStorage.getItem('game-config');
    if (!this.configuration && cacheConfig) {
      this.configuration = JSON.parse(cacheConfig);
    }
    return this.configuration;
  }

  public async verifyPlaylistValidity(playlistId: string): Promise<boolean> {
    return this.authenticationService.api.playlists
      .getPlaylist(playlistId)
      .then(() => {
        console.log('VALID');

        return true;
      })
      .catch(() => {
        console.log('NOT VALID');

        return false;
      });
  }

  public saveConfiguration(config: GameConfiguration) {
    this.configuration = config;
    localStorage.setItem('game-config', JSON.stringify(this.configuration));
  }
}
