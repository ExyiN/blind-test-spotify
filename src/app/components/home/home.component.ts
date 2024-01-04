import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  public isConnected!: Promise<boolean>;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.isConnected = this.authenticationService.isConnected();
  }

  public connect() {
    this.authenticationService.initApi();
  }

  public logOut() {
    this.authenticationService.logOut();
  }

  public createGame() {
    this.router.navigateByUrl('create');
  }
}
