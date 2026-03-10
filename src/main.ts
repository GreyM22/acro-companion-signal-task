import { Component, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { RouterModule } from '@angular/router';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet />
  `,
  imports: [RouterModule, MatSnackBarModule],
  // no need to define OnPush because the app is Zoneless
})
export class App {
  name = 'Angular';
  counter = signal(0);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // ...
  ],
};

// is zoneless by default
bootstrapApplication(App, appConfig);
