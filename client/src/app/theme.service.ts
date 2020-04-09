import { Injectable } from '@angular/core';

export const darkThemeGreen = {
  'background-color': '#1C1D21',
  'accent-color': '#70B77E',
  'font': 'Roboto Medium',
  'font-color': 'Black'
}

export const lightTheme = {}

@Injectable({
  providedIn: 'root'
})

export class ThemeService {
  toggleDarkThemeGreen() {
    this.setTheme(darkThemeGreen);
  }

  toggleLightTheme() {
    this.setTheme(lightTheme);
  }

  private setTheme(theme: {}) {
    Object.keys(theme).forEach(k => {
      document.documentElement.style.setProperty(`--${k}`, theme[k]);
    });
  }
}
