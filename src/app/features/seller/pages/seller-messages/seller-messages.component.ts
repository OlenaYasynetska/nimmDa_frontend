import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MarketplaceListingsService } from '../../../marketplace/services/marketplace-listings.service';
import { SellerMessagesService } from '../../services/seller-messages.service';

@Component({
  selector: 'app-seller-messages',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="mx-auto max-w-5xl">
      <a [routerLink]="backLink" class="text-sm font-medium text-[#2f6fb2] hover:underline">← Zurück zur Übersicht</a>
      <h1 class="mt-3 text-2xl font-extrabold text-[#1b3a5f]">Nachrichten</h1>
      <p class="mt-1 text-sm text-slate-500">Alle Unterhaltungen an einem Ort.</p>

      <div class="mt-6 grid overflow-hidden rounded-2xl bg-white shadow-sm md:grid-cols-[16rem_1fr]">
        <ul class="divide-y divide-slate-100 border-b border-slate-100 md:border-b-0 md:border-r">
          @if (messages.threads().length === 0 && !pendingListingId()) {
            <li class="px-4 py-6 text-sm text-slate-400">Noch keine Nachrichten.</li>
          }
          @for (thread of messages.threads(); track thread.id) {
            <li>
              <button
                type="button"
                class="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-slate-50"
                [class.bg-[#eaf8ef]]="messages.selectedId() === thread.id"
                (click)="messages.select(thread.id)"
              >
                <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                  {{ thread.initials }}
                </span>
                <span class="min-w-0 flex-1">
                  <span class="flex items-center justify-between gap-2">
                    <span class="truncate font-semibold text-slate-800">{{ thread.participant }}</span>
                    <span class="text-[11px] text-slate-400">{{ thread.time }}</span>
                  </span>
                  <span class="block truncate text-xs text-slate-500">{{ thread.productTitle }}</span>
                  <span class="block truncate text-sm text-slate-600">{{ thread.preview }}</span>
                </span>
                @if (thread.unread) {
                  <span class="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#2f9e57]"></span>
                }
              </button>
            </li>
          }
        </ul>

        @if (messages.selectedThread(); as thread) {
          <div class="flex min-h-[28rem] flex-col">
            <div class="border-b border-slate-100 px-4 py-3">
              <p class="font-semibold text-slate-800">{{ thread.participant }}</p>
              <p class="text-xs text-slate-500">{{ thread.productTitle }}</p>
            </div>
            <div class="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              @for (line of thread.messages; track line.id) {
                <div [class]="line.from === 'self' ? 'ml-8 text-right' : 'mr-8'">
                  <p
                    class="inline-block rounded-2xl px-3 py-2 text-sm"
                    [class]="line.from === 'self' ? 'bg-[#2f9e57] text-white' : 'bg-slate-100 text-slate-800'"
                  >
                    {{ line.text }}
                  </p>
                  <p class="mt-1 text-[11px] text-slate-400">{{ line.time }}</p>
                </div>
              }
            </div>
            <form class="flex gap-2 border-t border-slate-100 p-3" (ngSubmit)="send()">
              <input
                [(ngModel)]="draft"
                name="reply"
                placeholder="Nachricht schreiben..."
                class="min-w-0 flex-1 rounded-xl border-0 bg-slate-100 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
              <button
                type="submit"
                class="rounded-lg bg-[#2f9e57] px-4 py-2 text-sm font-semibold text-white hover:bg-[#278a4b] disabled:opacity-50"
                [disabled]="!draft.trim() || starting()"
              >
                Senden
              </button>
            </form>
          </div>
        } @else if (pendingListingId()) {
          <div class="flex min-h-[28rem] flex-col p-4">
            <p class="font-semibold text-slate-800">Nachricht zur Anzeige</p>
            <p class="mt-1 text-sm text-slate-500">Schreibe die erste Nachricht, um den Chat zu starten.</p>
            <form class="mt-4 flex gap-2" (ngSubmit)="startFromListing()">
              <input
                [(ngModel)]="draft"
                name="first"
                placeholder="Nachricht schreiben..."
                class="min-w-0 flex-1 rounded-xl border-0 bg-slate-100 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
              <button
                type="submit"
                class="rounded-lg bg-[#2f9e57] px-4 py-2 text-sm font-semibold text-white hover:bg-[#278a4b] disabled:opacity-50"
                [disabled]="!draft.trim() || starting()"
              >
                Senden
              </button>
            </form>
            @if (startError()) {
              <p class="mt-3 text-sm text-red-600">{{ startError() }}</p>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class SellerMessagesComponent implements OnInit {
  readonly messages = inject(SellerMessagesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly marketplace = inject(MarketplaceListingsService);
  draft = '';
  readonly pendingListingId = signal<string | null>(null);
  readonly starting = signal(false);
  readonly startError = signal<string | null>(null);

  get backLink(): string {
    return '/konto';
  }

  async ngOnInit(): Promise<void> {
    await this.messages.refresh();
    const threadId = this.route.snapshot.queryParamMap.get('thread');
    const listingId = this.route.snapshot.queryParamMap.get('listing');
    if (threadId) {
      this.messages.select(threadId);
      return;
    }
    if (listingId) {
      const existing = this.messages.threadForListing(listingId);
      if (existing) {
        this.messages.select(existing.id);
      } else {
        this.pendingListingId.set(listingId);
      }
    }
  }

  async send(): Promise<void> {
    await this.messages.reply(this.draft);
    this.draft = '';
  }

  async startFromListing(): Promise<void> {
    const listingId = this.pendingListingId();
    const text = this.draft.trim();
    if (!listingId || !text || this.starting()) {
      return;
    }
    this.starting.set(true);
    this.startError.set(null);
    try {
      const conversation = await this.marketplace.sendInquiry(listingId, text);
      this.draft = '';
      this.pendingListingId.set(null);
      await this.messages.refresh();
      if (conversation.id) {
        this.messages.select(conversation.id);
        await this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { thread: conversation.id },
          replaceUrl: true,
        });
      }
    } catch {
      this.startError.set('Nachricht konnte nicht gesendet werden.');
    } finally {
      this.starting.set(false);
    }
  }
}
