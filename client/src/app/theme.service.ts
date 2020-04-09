import { Injectable } from '@angular/core';

export const darkTheme = {
  'background-color': '#1C1D21',
  'navbar-background-color': '#428081',
  'accent-color': '#196466',
  'font': 'Roboto Medium',
  'font-transparency': 0.95,
  'font-color': 'white',
  'card-background-color': '#39393B',
  'card-text-color': 'white',
  'hover-color': '#87898f'
}

export const lightTheme = {
  'background-color': '#ebeeff',
  'navbar-background-color': '#542361',
  'accent-color': '#6f94a0',
  'font-color': 'black',
  'card-background-color': 'white',
  'card-text-color': 'black',
  'hover-color': '#ebeeff'
}

@Injectable({
  providedIn: 'root'
})

export class ThemeService {
  toggleDarkTheme() {
    this.setTheme(darkTheme);
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
