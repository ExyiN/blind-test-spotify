import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-end',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './end.component.html',
  styleUrl: './end.component.css',
})
export class EndComponent {
  constructor(private router: Router) {}

  public goToHome() {
    this.router.navigateByUrl('home');
  }
}
