import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {
  constructor(private gameService: GameService) {}

  public next() {}
}
