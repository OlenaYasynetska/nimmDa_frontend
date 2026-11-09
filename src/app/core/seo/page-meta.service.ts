import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

const SITE_ORIGIN = 'https://www.nimmda.org';

export interface PageMeta {
  title: string;
  description: string;
  path: string;
  robots?: string;
}

/** Writes the title, description and canonical URL into the document head before HTML is sent. */
@Injectable({ providedIn: 'root' })
export class PageMetaService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  apply(page: PageMeta): void {
    const url = `${SITE_ORIGIN}${page.path.startsWith('/') ? page.path : `/${page.path}`}`;
    const description = page.description.replace(/\s+/g, ' ').trim().slice(0, 160);
    this.title.setTitle(page.title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: page.robots ?? 'index, follow' });
    this.meta.updateTag({ property: 'og:title', content: page.title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.canonical(url);
  }

  private canonical(href: string): void {
    const head = this.document.head;
    if (!head) {
      return;
    }
    let link = head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    link.setAttribute('href', href);
  }
}
