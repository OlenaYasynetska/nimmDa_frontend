import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageMetaService } from '../../../../core/seo/page-meta.service';
import { LandingFooterComponent } from '../../components/landing-footer/landing-footer.component';
import { LandingHeaderComponent } from '../../components/landing-header/landing-header.component';
import { SITE_OPERATOR } from '../../data/footer-docs.content';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, LandingHeaderComponent, LandingFooterComponent],
  host: {
    class: 'block min-h-full w-full bg-[#f3f5f8]',
  },
  template: `
    <app-landing-header />
    <main class="container px-4 py-8 md:px-8 md:py-12">
      <a routerLink="/" class="text-sm font-medium text-[#2f6fb2] hover:underline">← Zur Startseite</a>
      <article class="mx-auto mt-6 max-w-3xl">
        <header class="rounded-2xl bg-white p-6 shadow-sm md:p-10">
          <h1 class="text-2xl font-extrabold text-[#1b3a5f] md:text-3xl">Über NimmDa</h1>
          <p class="mt-2 text-sm font-semibold uppercase tracking-wide text-[#2f9e57]">
            Regional. Einfach. Gemeinsam.
          </p>
          <p class="mt-4 text-base leading-relaxed text-slate-700">
            Willkommen bei NimmDa – deinem regionalen Online-Marktplatz mit besonderem Fokus auf
            Oberösterreich.
          </p>
          <p class="mt-3 text-sm leading-relaxed text-slate-700">
            Unsere Idee ist es, Menschen aus der Region miteinander zu verbinden und das Kaufen,
            Verkaufen und Entdecken von Angeboten im eigenen Umfeld einfacher zu machen.
          </p>
        </header>

        <ul class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          @for (point of points; track point.title) {
            <li class="rounded-2xl bg-white p-4 shadow-sm">
              <p class="text-sm font-bold text-[#1b3a5f]">{{ point.title }}</p>
              <p class="mt-1 text-sm text-slate-600">{{ point.text }}</p>
            </li>
          }
        </ul>

        <section class="mt-4 rounded-2xl bg-white p-6 shadow-sm md:p-10">
          <h2 class="text-base font-semibold text-slate-900">Unsere Mission</h2>
          <p class="mt-2 text-sm leading-relaxed text-slate-700">
            Wir möchten den regionalen Austausch fördern, lokalen Angeboten mehr Sichtbarkeit geben
            und dazu beitragen, dass gut erhaltene Dinge ein zweites Leben bekommen.
          </p>

          <h2 class="mt-6 text-base font-semibold text-slate-900">Warum NimmDa?</h2>
          <ul class="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
            <li>Regionaler Fokus auf Oberösterreich</li>
            <li>Einfaches Erstellen und Entdecken von Anzeigen</li>
            <li>Direkter Kontakt zwischen Interessenten und Anbietern</li>
            <li>Förderung von Nachhaltigkeit und Wiederverwendung</li>
            <li>Ein Marktplatz für Menschen aus der Region</li>
          </ul>

          <h2 class="mt-6 text-base font-semibold text-slate-900">Vertrauen und Sicherheit</h2>
          <p class="mt-2 text-sm leading-relaxed text-slate-700">
            Ein respektvoller, fairer und verantwortungsvoller Umgang ist uns wichtig. Unser Ziel ist
            es, eine vertrauenswürdige Plattform für den regionalen Austausch aufzubauen.
          </p>

          <h2 class="mt-6 text-base font-semibold text-slate-900">Wer dahinter steht</h2>
          <p class="mt-2 text-sm leading-relaxed text-slate-700">
            {{ operator.name }} aus Steyr entwickelt und betreibt NimmDa. Die gesetzlichen Angaben
            stehen im
            <a routerLink="/impressum" class="font-medium text-[#2f6fb2] hover:underline">Impressum</a>.
          </p>

          <h2 class="mt-6 text-base font-semibold text-slate-900">Gemeinsam wachsen</h2>
          <p class="mt-2 text-sm leading-relaxed text-slate-700">
            NimmDa ist ein regionales Projekt, das sich weiterentwickelt. Wir freuen uns über deine
            Ideen, Anregungen und dein Feedback.
          </p>
          <p class="mt-3 text-sm leading-relaxed text-slate-700">
            Bei Fragen kannst du uns gerne über unsere
            <a routerLink="/kontakt" class="font-medium text-[#2f6fb2] hover:underline">Kontaktseite</a>
            erreichen.
          </p>
          <p class="mt-6 text-sm font-semibold text-[#1b3a5f]">
            NimmDa – Entdecke, was ganz in deiner Nähe ist.
          </p>
          <div class="mt-4 flex flex-col gap-2 sm:flex-row">
            <a
              routerLink="/anzeigen"
              class="inline-flex items-center justify-center rounded-full bg-[#2f9e57] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#278a4b]"
            >
              Jetzt entdecken
            </a>
            <a
              routerLink="/kontakt"
              class="inline-flex items-center justify-center rounded-full border border-[#1b3a5f] px-5 py-2.5 text-sm font-semibold text-[#1b3a5f] hover:bg-slate-50"
            >
              Kontakt
            </a>
          </div>
        </section>
      </article>
    </main>
    <app-landing-footer />
  `,
})
export class AboutComponent {
  readonly operator = SITE_OPERATOR;
  readonly points = [
    { title: 'Regional', text: 'In deiner Nähe' },
    { title: 'Gemeinsam', text: 'Menschen verbinden' },
    { title: 'Nachhaltig', text: 'Wiederverwenden' },
  ];

  constructor() {
    inject(PageMetaService).apply({
      title: 'Über NimmDa – Dein regionaler Marktplatz',
      description:
        'NimmDa ist ein regionaler Online-Marktplatz mit Fokus auf Oberösterreich: kaufen, verkaufen und Angebote in der Nähe entdecken.',
      path: '/ueber-uns',
    });
  }
}
