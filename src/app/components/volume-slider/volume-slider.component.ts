import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../services/configuration.service';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-volume-slider',
  standalone: true,
  imports: [FormsModule, SliderModule],
  templateUrl: './volume-slider.component.html',
  styleUrl: './volume-slider.component.css',
})
export class VolumeSliderComponent implements OnInit {
  public volume!: number;

  constructor(
    private configurationService: ConfigurationService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.volume = this.configurationService.getPlayerVolume();
  }

  public modifyVolume() {
    this.configurationService.modifyVolume(this.volume);
    this.authenticationService.api.player.setPlaybackVolume(
      this.volume,
      this.configurationService.getConfiguration().deviceId
    );
  }
}
