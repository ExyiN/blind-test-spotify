import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    public authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.authenticationService.initApi();
    this.activatedRoute.queryParams.subscribe({
      next: (params: Params) => {
        if (params['code']) {
          this.connect();
        } else if (params['error']) {
          this.logOut();
        }
      },
    });
  }

  public connect() {
    this.authenticationService.connect();
  }

  public logOut() {
    this.authenticationService.logOut();
  }

  public createGame() {
    this.router.navigateByUrl('create');
  }
}
