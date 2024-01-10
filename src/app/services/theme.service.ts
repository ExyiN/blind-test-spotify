import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  public toggleTheme() {
    const currentTheme: string | null = localStorage.getItem('app-theme');
    let theme: string;
    const themeLink = this.document.getElementById(
      'app-theme'
    ) as HTMLLinkElement;
    if (!currentTheme || currentTheme === 'light') {
      theme = 'dark';
      themeLink.href = 'lara-dark-green.css';
    } else {
      theme = 'light';
      themeLink.href = 'lara-light-green.css';
    }
    localStorage.setItem('app-theme', theme);
  }

  public initTheme() {
    const theme: string | null = localStorage.getItem('app-theme');
    const themeLink = this.document.getElementById(
      'app-theme'
    ) as HTMLLinkElement;

    if (!theme || theme === 'light') {
      themeLink.href = 'lara-light-green.css';
    } else {
      themeLink.href = 'lara-dark-green.css';
    }
  }

  public getTheme(): string {
    return localStorage.getItem('app-theme') ?? 'light';
  }
}
