import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import {
  SELLER_CHECKLIST,
  SELLER_NEWS,
  SELLER_RATING,
  SELLER_TIPS,
  SELLER_TREND,
} from '../../data/seller.content';
import { SellerListingsService } from '../../services/seller-listings.service';
import { SellerMessagesService } from '../../services/seller-messages.service';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="mx-auto flex max-w-7xl flex-col gap-6 xl:flex-row">
      <div class="min-w-0 flex-1 space-y-6">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 class="text-2xl font-extrabold text-[#1b3a5f]">Hallo, {{ greetingName }}! 👋</h1>
            <p class="mt-1 text-sm text-slate-500">
              Schön, dass du da bist! Hier ist dein Verkäufer-Dashboard.
            </p>
          </div>
          <a
            routerLink="/seller/listings/new"
            class="inline-flex items-center gap-1 rounded-lg bg-[#2f9e57] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#278a4b]"
          >
            Anzeige erstellen +
          </a>
        </div>

        <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
          <article class="rounded-2xl bg-white p-4 shadow-sm">
            <p class="text-xs font-medium text-slate-500">Anzeigen aktiv</p>
            <p class="mt-1 text-2xl font-extrabold text-[#2f9e57]">{{ listings.activeCount() }}</p>
          </article>
          <article class="rounded-2xl bg-white p-4 shadow-sm">
            <p class="text-xs font-medium text-slate-500">Aufrufe (30 Tage)</p>
            <p class="mt-1 text-2xl font-extrabold text-[#6f4ea1]">{{ listings.totalViews() }}</p>
          </article>
          <article class="rounded-2xl bg-white p-4 shadow-sm">
            <p class="text-xs font-medium text-slate-500">Anfragen (30 Tage)</p>
            <p class="mt-1 text-2xl font-extrabold text-[#d97706]">{{ listings.totalChats() }}</p>
          </article>
          <article class="rounded-2xl bg-white p-4 shadow-sm">
            <p class="text-xs font-medium text-slate-500">Verkäufe (30 Tage)</p>
            <p class="mt-1 text-2xl font-extrabold text-[#2f6fb2]">{{ listings.salesCount }}</p>
          </article>
        </div>

        <section class="rounded-2xl bg-white p-5 shadow-sm">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-slate-800">Übersicht</h2>
            <span class="text-xs text-slate-400">Letzte 30 Tage</span>
          </div>
          <svg viewBox="0 0 320 110" class="h-40 w-full text-slate-200" aria-hidden="true">
            <polyline fill="none" stroke="#c4b5fd" stroke-width="2" [attr.points]="viewPoints" />
            <polyline fill="none" stroke="#fb923c" stroke-width="2" [attr.points]="inquiryPoints" />
            <polyline fill="none" stroke="#60a5fa" stroke-width="2" [attr.points]="salesPoints" />
          </svg>
          <div class="mt-2 flex gap-4 text-xs text-slate-500">
            <span class="inline-flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-violet-400"></span> Aufrufe</span>
            <span class="inline-flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-orange-400"></span> Anfragen</span>
            <span class="inline-flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-blue-400"></span> Verkäufe</span>
          </div>
        </section>

        <section class="rounded-2xl bg-white p-5 shadow-sm">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-slate-800">Aktuelle Anzeigen</h2>
            <a routerLink="/seller/listings/new" class="text-sm font-medium text-[#2f6fb2] hover:underline">
              Neue Anzeige
            </a>
          </div>
          <ul class="divide-y divide-slate-100">
            @for (item of listings.listings(); track item.id) {
              <li class="flex items-center gap-3 py-3">
                <img [src]="item.imageSrc" [alt]="item.title" class="h-14 w-14 rounded-lg bg-slate-100 object-cover" />
                <div class="min-w-0 flex-1">
                  <p class="truncate font-semibold text-slate-800">{{ item.title }}</p>
                  <p class="text-sm text-slate-500">€ {{ item.price }} · {{ item.views }} Aufrufe · {{ item.chats }} Chats</p>
                </div>
                <span
                  class="rounded-full px-2.5 py-1 text-xs font-semibold"
                  [class]="item.status === 'aktiv' ? 'bg-[#eaf8ef] text-[#2f9e57]' : 'bg-orange-100 text-orange-700'"
                >
                  {{ item.status === 'aktiv' ? 'Aktiv' : 'Pausiert' }}
                </span>
                <details class="relative">
                  <summary class="cursor-pointer list-none rounded-md px-2 py-1 text-lg leading-none text-slate-400 hover:bg-slate-50 hover:text-slate-700">
                    ⋮
                  </summary>
                  <div class="absolute right-0 z-10 mt-1 w-36 rounded-lg border border-slate-100 bg-white py-1 shadow-md">
                    <button
                      type="button"
                      class="block w-full px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                      (click)="toggleStatus(item.id, item.status)"
                    >
                      {{ item.status === 'aktiv' ? 'Pausieren' : 'Aktivieren' }}
                    </button>
                  </div>
                </details>
              </li>
            }
          </ul>
        </section>

        <section class="rounded-2xl bg-white p-5 shadow-sm">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-slate-800">Letzte Nachrichten</h2>
            <a routerLink="/seller/messages" class="text-sm font-medium text-[#2f6fb2] hover:underline">Alle anzeigen</a>
          </div>
          <ul class="divide-y divide-slate-100">
            @for (thread of messages.threads(); track thread.id) {
              <li>
                <a
                  routerLink="/seller/messages"
                  [queryParams]="{ thread: thread.id }"
                  class="flex items-start gap-3 py-3 hover:bg-slate-50"
                >
                  <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                    {{ thread.initials }}
                  </span>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center justify-between gap-2">
                      <p class="font-semibold text-slate-800">{{ thread.buyerName }}</p>
                      <span class="text-xs text-slate-400">{{ thread.time }}</span>
                    </div>
                    <p class="truncate text-xs text-slate-500">{{ thread.productTitle }}</p>
                    <p class="truncate text-sm text-slate-600">{{ thread.preview }}</p>
                  </div>
                  @if (thread.unread) {
                    <span class="mt-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2f9e57] px-1 text-[10px] font-bold text-white">1</span>
                  }
                </a>
              </li>
            }
          </ul>
        </section>
      </div>

      <aside class="w-full shrink-0 space-y-4 xl:w-72">
        <section class="rounded-2xl bg-white p-4 shadow-sm">
          <h3 class="font-bold text-slate-800">Tipps für mehr Erfolg</h3>
          <ul class="mt-3 space-y-3">
            @for (tip of tips; track tip.title) {
              <li>
                <p class="text-sm font-semibold text-slate-700">{{ tip.title }}</p>
                <p class="text-sm text-slate-500">{{ tip.text }}</p>
              </li>
            }
          </ul>
        </section>

        <section class="rounded-2xl bg-white p-4 shadow-sm">
          <h3 class="font-bold text-slate-800">Verkäufer-Checkliste</h3>
          <p class="mt-1 text-xs text-slate-500">{{ checklistDone }} von {{ checklist.length }} erledigt</p>
          <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div class="h-full rounded-full bg-[#2f9e57]" [style.width.%]="checklistDone / checklist.length * 100"></div>
          </div>
          <ul class="mt-3 space-y-2 text-sm">
            @for (item of checklist; track item.label) {
              <li class="flex items-center gap-2" [class]="item.done ? 'text-slate-500' : 'text-slate-700'">
                <span
                  class="flex h-4 w-4 items-center justify-center rounded border text-[10px]"
                  [class]="item.done ? 'border-[#2f9e57] bg-[#2f9e57] text-white' : 'border-slate-300'"
                >
                  @if (item.done) { ✓ }
                </span>
                {{ item.label }}
              </li>
            }
          </ul>
        </section>

        <section class="rounded-2xl bg-[#eaf8ef] p-4">
          <h3 class="font-bold text-[#1b3a5f]">NimmDa Pro</h3>
          <p class="mt-2 text-sm text-slate-600">Mehr Reichweite für deine Anzeigen in Oberösterreich.</p>
        </section>

        <section class="rounded-2xl bg-white p-4 shadow-sm">
          <h3 class="font-bold text-slate-800">Deine Bewertungen</h3>
          <p class="mt-2 text-2xl font-extrabold text-[#1b3a5f]">{{ rating.score }} <span class="text-sm font-medium text-slate-500">von 5</span></p>
          <p class="text-xs text-slate-400">{{ rating.count }} Bewertungen</p>
          <ul class="mt-3 space-y-1">
            @for (bar of rating.bars; track $index) {
              <li class="flex items-center gap-2 text-xs text-slate-500">
                <span class="w-4">{{ 5 - $index }}</span>
                <span class="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <span class="block h-full rounded-full bg-[#f5c400]" [style.width.%]="bar / rating.count * 100"></span>
                </span>
              </li>
            }
          </ul>
        </section>

        <section class="rounded-2xl bg-white p-4 shadow-sm">
          <h3 class="font-bold text-slate-800">Neuigkeiten</h3>
          <ul class="mt-3 space-y-2">
            @for (item of news; track item.title) {
              <li>
                <p class="text-sm font-medium text-slate-700">{{ item.title }}</p>
                <p class="text-xs text-slate-400">{{ item.date }}</p>
              </li>
            }
          </ul>
        </section>
      </aside>
    </div>
  `,
})
export class SellerDashboardComponent {
  readonly listings = inject(SellerListingsService);
  readonly messages = inject(SellerMessagesService);
  private readonly auth = inject(AuthService);
  readonly tips = SELLER_TIPS;
  readonly checklist = SELLER_CHECKLIST;
  readonly rating = SELLER_RATING;
  readonly news = SELLER_NEWS;
  readonly checklistDone = SELLER_CHECKLIST.filter((item) => item.done).length;
  readonly viewPoints = this.toPoints(SELLER_TREND.views, 100);
  readonly inquiryPoints = this.toPoints(SELLER_TREND.inquiries, 100);
  readonly salesPoints = this.toPoints(SELLER_TREND.sales, 12);

  get greetingName(): string {
    return this.auth.currentUser()?.firstName || 'Verkäufer';
  }

  toggleStatus(id: string, status: 'aktiv' | 'pausiert'): void {
    this.listings.setStatus(id, status === 'aktiv' ? 'pausiert' : 'aktiv');
  }

  private toPoints(values: number[], max: number): string {
    return values
      .map((value, index) => {
        const x = (index / (values.length - 1)) * 320;
        const y = 100 - (value / max) * 90;
        return `${x},${y}`;
      })
      .join(' ');
  }
}
