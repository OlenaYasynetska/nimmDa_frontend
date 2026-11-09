import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PageMetaService } from '../../../../core/seo/page-meta.service';
import { map } from 'rxjs';
import { LandingFooterComponent } from '../../components/landing-footer/landing-footer.component';
import { LandingHeaderComponent } from '../../components/landing-header/landing-header.component';
import { FOOTER_DOCS, type FooterDocId } from '../../data/footer-docs.content';

@Component({
  selector: 'app-site-doc',
  standalone: true,
  imports: [RouterLink, LandingHeaderComponent, LandingFooterComponent],
  host: {
    class: 'block min-h-full w-full bg-[#f3f5f8]',
  },
  template: `
    <app-landing-header />
    <main class="container px-4 py-8 md:px-8 md:py-12">
      <a routerLink="/" class="text-sm font-medium text-[#2f6fb2] hover:underline">← Zur Startseite</a>
      <article class="mx-auto mt-6 max-w-3xl rounded-2xl bg-white p-6 shadow-sm md:p-10">
        <h1 class="text-2xl font-extrabold text-[#1b3a5f] md:text-3xl">{{ doc().title }}</h1>
        <div class="mt-6 space-y-5 text-sm leading-relaxed text-slate-700">
          @for (section of doc().sections; track $index) {
            <section>
              @if (section.heading) {
                <h2 class="mb-1.5 text-base font-semibold text-slate-900">{{ section.heading }}</h2>
              }
              @for (paragraph of section.paragraphs ?? []; track $index) {
                <p class="whitespace-pre-line" [class.mt-2]="$index > 0">{{ paragraph }}</p>
              }
              @if (section.items?.length) {
                <ul class="mt-2 list-disc space-y-1 pl-5">
                  @for (item of section.items; track item) {
                    <li>{{ item }}</li>
                  }
                </ul>
              }
              @if (section.email) {
                <p class="mt-2">
                  @if (section.emailLabel) {
                    {{ section.emailLabel }}
                  }
                  <a class="text-[#2f6fb2] hover:underline" [href]="'mailto:' + section.email">{{ section.email }}</a>
                </p>
              }
            </section>
          }
        </div>
      </article>
    </main>
    <app-landing-footer />
  `,
})
export class SiteDocComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pageMeta = inject(PageMetaService);

  private readonly docId = toSignal(
    this.route.data.pipe(map((data) => data['doc'] as FooterDocId)),
    { initialValue: this.route.snapshot.data['doc'] as FooterDocId }
  );

  readonly doc = computed(() => FOOTER_DOCS[this.docId()] ?? FOOTER_DOCS.datenschutz);

  constructor() {
    effect(() => {
      const doc = this.doc();
      const description = doc.sections[0]?.paragraphs?.[0] ?? doc.title;
      this.pageMeta.apply({
        title: `${doc.title} – NimmDa`,
        description,
        path: this.router.url.split('?')[0] || '/',
      });
    });
  }
}
