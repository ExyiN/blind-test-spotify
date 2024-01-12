import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Device, Devices } from '@spotify/web-api-ts-sdk';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { AuthenticationService } from '../../services/authentication.service';
import { ConfigurationService } from '../../services/configuration.service';
import { InputSwitchModule } from 'primeng/inputswitch';

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
  public availableDevices: Device[] = [];
  public minTracks: number = 5;
  public maxTracks: number = 30;
  public minDuration: number = 1;
  public maxDuration: number = 60;

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private configurationService: ConfigurationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchAvailableDevices();
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
  }

  public searchAvailableDevices() {
    this.authenticationService.api.player
      .getAvailableDevices()
      .then((devices: Devices) => {
        this.availableDevices = devices.devices;
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
  }
}
