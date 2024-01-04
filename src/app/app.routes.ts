import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CreateGameComponent } from './components/create-game/create-game.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'create', component: CreateGameComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home' },
];
