import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Observable, skip } from 'rxjs';
import { ConfigurationService } from '../../services/configuration.service';
import { GameService } from '../../services/game.service';
import { TimerService } from '../../services/timer.service';
import { Track } from '@spotify/web-api-ts-sdk';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ProgressBarModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
  public timeLeft!: Observable<number>;
  public guessDuration!: number;
  public isPlaying!: boolean;
  public isGameInit!: boolean;

  constructor(
    private configurationService: ConfigurationService,
    private gameService: GameService,
    private timer: TimerService
  ) {}

  ngOnInit(): void {
    this.isGameInit = false;
    this.guessDuration =
      this.configurationService.getConfiguration().guessDuration;
    this.timeLeft = this.timer.timer;
    this.gameService.initGame().then(() => {
      this.isGameInit = true;
      this.nextSong();
    });
    this.timeLeft.pipe(skip(1)).subscribe({
      next: (value: number) => {
        if (value <= 0) {
          this.isPlaying = false;
          this.gameService.pausePlayer();
        }
      },
    });
  }

  public nextSong() {
    this.isPlaying = true;
    this.gameService.playNextSong().then(() => {
      this.timer.start(this.guessDuration);
    });
  }

  public getCurrentTrack(): Track {
    return this.gameService.getCurrentTrack();
  }
}
