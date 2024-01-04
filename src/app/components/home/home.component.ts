import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, InputTextModule, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  public playlistId!: string;

  constructor(
    private gameService: GameService,
    private messageService: MessageService
  ) {}

  public play() {
    this.gameService
      .getPlaylistItems(this.playlistId)
      .then((res) => {
        this.gameService.saveConfig(30);
        this.gameService.createQueue(res.items, 10, []);
      })
      .catch(() => {
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'ID de playlist invalide',
          life: 5000,
        });
      });
  }
}
