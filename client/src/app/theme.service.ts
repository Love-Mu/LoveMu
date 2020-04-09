import { Injectable } from '@angular/core';

export const darkTheme = {
  'background-color': '#1C1D21',
  'navbar-background-color': '#428081',
  'accent-color': '#196466',
  'font': 'Roboto Medium',
  'font-transparency': 0.95,
  'font-color': 'White',
  'card-background': '#39393B'
}

export const lightTheme = {
  'background-color': '#ebeeff',
  'navbar-background-color': '#473f53'
}

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
