import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdConsentComponent } from './core/ads/ad-consent.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AdConsentComponent],
  host: {
    class: 'block min-h-full',
  },
  template: `<router-outlet /><app-ad-consent />`,
})
export class AppComponent {}
