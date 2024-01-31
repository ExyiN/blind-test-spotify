import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Track } from '@spotify/web-api-ts-sdk';
import { Observable, skip } from 'rxjs';
import { ConfigurationService } from '../../services/configuration.service';
import { GameService } from '../../services/game.service';
import { LoaderService } from '../../services/loader.service';
import { TimerService } from '../../services/timer.service';
import { AnswerComponent } from '../answer/answer.component';
import { LoaderComponent } from '../loader/loader.component';
import { TimerComponent } from '../timer/timer.component';
import { VolumeSliderComponent } from '../volume-slider/volume-slider.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    LoaderComponent,
    TimerComponent,
    AnswerComponent,
    VolumeSliderComponent,
    CommonModule,
    ButtonModule,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
  public timeLeft!: Observable<number>;
  public guessDuration!: number;
  public isPlaying!: boolean;
  public isLoading!: Observable<boolean>;
  public volume!: number;

  constructor(
    private configurationService: ConfigurationService,
    private gameService: GameService,
    private timer: TimerService,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.isLoading = this.loader.isLoading;
    this.guessDuration =
      this.configurationService.getConfiguration().guessDuration;
    this.volume = this.configurationService.getPlayerVolume();
    this.timeLeft = this.timer.timer;
    this.gameService.initGame().then(() => {
      this.loader.setLoading(false);
      this.nextSong();
    });
    this.timeLeft.pipe(skip(1)).subscribe({
      next: (value: number) => {
        if (value < 0) {
          this.isPlaying = false;
          this.gameService.pausePlayer();
        }
      },
    });
  }

  public nextSong() {
    if (
      this.gameService.getCurrentTrackIndex() ===
      this.configurationService.getConfiguration().numberOfTracks - 1
    ) {
      this.gameService.endGame();
      return;
    }
    this.isPlaying = true;
    this.gameService.playNextSong();
  }

  public skip() {
    this.timer.setTime(3);
  }

  public getCurrentTrack(): Track {
    return this.gameService.getCurrentTrack();
  }

  public getGameProgression(): string {
    return `${this.gameService.getCurrentTrackIndex() + 1} / ${
      this.configurationService.getConfiguration().numberOfTracks
    }`;
  }
}
