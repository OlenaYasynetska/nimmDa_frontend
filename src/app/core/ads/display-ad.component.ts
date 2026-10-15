import { Component, ElementRef, afterRenderEffect, inject } from '@angular/core';
import { AdSenseService } from './ad-sense.service';

@Component({
  selector: 'app-display-ad',
  standalone: true,
  template: `
    @if (ads.enabled()) {
      <aside class="my-8" aria-label="Anzeige">
        <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Anzeige</p>
        <ins
          class="adsbygoogle"
          style="display:block"
          [attr.data-ad-client]="ads.clientId"
          [attr.data-ad-slot]="ads.slotId"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </aside>
    }
  `,
})
export class DisplayAdComponent {
  readonly ads = inject(AdSenseService);
  private readonly host = inject(ElementRef<HTMLElement>);
  private pushed = false;

  constructor() {
    afterRenderEffect(() => {
      this.ads.loadScript();
      if (!this.ads.enabled() || this.pushed) return;
      const ins = this.host.nativeElement.querySelector('ins.adsbygoogle');
      if (!ins) return;
      this.pushed = true;
      window.adsbygoogle = window.adsbygoogle ?? [];
      window.adsbygoogle.push({});
    });
  }
}
