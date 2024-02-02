import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { ConfigurationService } from '../../services/configuration.service';
import { PlayerService } from '../../services/player.service';

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
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    this.volume = this.configurationService.getPlayerVolume() * 100;
  }

  public modifyVolume() {
    this.configurationService.modifyVolume(this.volume / 100);
    this.playerService.player.setVolume(this.volume / 100);
  }
}
