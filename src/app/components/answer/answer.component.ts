import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-answer',
  standalone: true,
  imports: [ButtonModule, ImageModule],
  templateUrl: './answer.component.html',
  styleUrl: './answer.component.css',
})
export class AnswerComponent {
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

  public next() {
    this.onNext.emit();
  }
}
