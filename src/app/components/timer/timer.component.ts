import { Component, Input } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [ProgressBarModule],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css',
})
export class TimerComponent {
  @Input()
  public timeLeft!: number;
  @Input()
  public startTime!: number;
}
