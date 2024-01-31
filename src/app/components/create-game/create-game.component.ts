import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { skip } from 'rxjs';
import { ConfigurationService } from '../../services/configuration.service';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-create-game',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputNumberModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    InputSwitchModule,
  ],
  templateUrl: './create-game.component.html',
  styleUrl: './create-game.component.css',
})
export class CreateGameComponent implements OnInit {
  public config!: FormGroup;
  public minTracks: number = 5;
  public maxTracks: number = 30;
  public minDuration: number = 1;
  public maxDuration: number = 60;

  constructor(
    private fb: FormBuilder,
    private configurationService: ConfigurationService,
    private router: Router,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    this.config = this.fb.group({
      deviceId: [null, [Validators.required]],
      playlistId: [null, [Validators.required]],
      numberOfTracks: [
        10,
        [
          Validators.required,
          Validators.min(this.minTracks),
          Validators.max(this.maxTracks),
        ],
      ],
      guessDuration: [
        20,
        [
          Validators.required,
          Validators.min(this.minDuration),
          Validators.max(this.maxDuration),
        ],
      ],
      hideAnswers: [false, [Validators.required]],
    });
    this.playerService.createPlayer();
    this.playerService.deviceId.pipe(skip(1)).subscribe({
      next: (deviceId: string | null) => {
        this.config.get('deviceId')?.patchValue(deviceId);
      },
    });
  }

  public play() {
    if (this.config.invalid) {
      return;
    }
    this.configurationService
      .verifyPlaylistValidity(this.config.get('playlistId')?.value)
      .then((isValid: boolean) => {
        if (isValid) {
          this.configurationService.saveConfiguration(this.config.value);
          this.router.navigateByUrl('game');
        } else {
          this.config.get('playlistId')?.setErrors({ invalidId: true });
        }
      });
  }

  public goToHome() {
    this.router.navigateByUrl('home');
    this.playerService.disconnect();
  }
}
