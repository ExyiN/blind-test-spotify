import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { ConfigurationService } from '../../services/configuration.service';

@Component({
  selector: 'app-answer',
  standalone: true,
  imports: [ButtonModule, ImageModule],
  templateUrl: './answer.component.html',
  styleUrl: './answer.component.css',
})
export class AnswerComponent implements OnInit {
  @Input()
  public albumImg!: string;
  @Input()
  public albumName!: string;
  @Input()
  public artistName!: string;
  @Input()
  public title!: string;
  @Output()
  public onNext = new EventEmitter<void>();

  public hideAnswer!: boolean;

  constructor(private configurationService: ConfigurationService) {}

  ngOnInit(): void {
    this.hideAnswer = this.configurationService.getConfiguration().hideAnswers;
  }

  public showAnswer() {
    this.hideAnswer = false;
  }

  public next() {
    this.onNext.emit();
  }
}
