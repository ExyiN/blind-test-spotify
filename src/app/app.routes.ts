import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CreateGameComponent } from './components/create-game/create-game.component';
import { GameComponent } from './components/game/game.component';
import { EndComponent } from './components/end/end.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'create', component: CreateGameComponent },
  { path: 'game', component: GameComponent },
  { path: 'end', component: EndComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home' },
];
