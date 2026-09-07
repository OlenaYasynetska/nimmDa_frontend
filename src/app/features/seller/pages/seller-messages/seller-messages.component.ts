import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SellerMessagesService } from '../../services/seller-messages.service';

@Component({
  selector: 'app-seller-messages',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="mx-auto max-w-5xl">
      <a routerLink="/seller" class="text-sm font-medium text-[#2f6fb2] hover:underline">← Zurück zur Übersicht</a>
      <h1 class="mt-3 text-2xl font-extrabold text-[#1b3a5f]">Nachrichten</h1>
      <p class="mt-1 text-sm text-slate-500">Kommunikation mit Käuferinnen und Käufern.</p>

      <div class="mt-6 grid overflow-hidden rounded-2xl bg-white shadow-sm md:grid-cols-[16rem_1fr]">
        <ul class="divide-y divide-slate-100 border-b border-slate-100 md:border-b-0 md:border-r">
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
                    <span class="truncate font-semibold text-slate-800">{{ thread.buyerName }}</span>
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
              <p class="font-semibold text-slate-800">{{ thread.buyerName }}</p>
              <p class="text-xs text-slate-500">{{ thread.productTitle }}</p>
            </div>
            <div class="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              @for (line of thread.messages; track line.id) {
                <div [class]="line.from === 'seller' ? 'ml-8 text-right' : 'mr-8'">
                  <p
                    class="inline-block rounded-2xl px-3 py-2 text-sm"
                    [class]="line.from === 'seller' ? 'bg-[#2f9e57] text-white' : 'bg-slate-100 text-slate-800'"
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
                [disabled]="!draft.trim()"
              >
                Senden
              </button>
            </form>
          </div>
        }
      </div>
    </div>
  `,
})
export class SellerMessagesComponent implements OnInit {
  readonly messages = inject(SellerMessagesService);
  private readonly route = inject(ActivatedRoute);
  draft = '';

  ngOnInit(): void {
    const threadId = this.route.snapshot.queryParamMap.get('thread');
    if (threadId) {
      this.messages.select(threadId);
    }
  }

  async send(): Promise<void> {
    await this.messages.reply(this.draft);
    this.draft = '';
  }
}
