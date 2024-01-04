import { Injectable } from '@angular/core';
import { Devices, PlaylistedTrack, SpotifyApi } from '@spotify/web-api-ts-sdk';
import { environment } from '../../environment/environment';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private authenticationService: AuthenticationService) {}
}
