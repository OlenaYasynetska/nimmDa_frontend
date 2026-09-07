import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import type { SellerChatLine, SellerThread } from '../data/seller.content';

interface MessageDto {
  author: string;
  text: string;
  createdAt: string;
}

interface ConversationDto {
  id: string;
  buyerName: string;
  listingTitle: string;
  preview: string;
  updatedAt: string;
  messages: MessageDto[];
}

@Injectable({ providedIn: 'root' })
export class SellerMessagesService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly threadsSignal = signal<SellerThread[]>([]);
  private readonly selectedIdSignal = signal<string | null>(null);

  readonly threads = this.threadsSignal.asReadonly();
  readonly selectedId = this.selectedIdSignal.asReadonly();
  readonly unreadCount = computed(
    () => this.threadsSignal().filter((thread) => thread.unread).length
  );
  readonly selectedThread = computed(() => {
    const id = this.selectedIdSignal();
    return this.threadsSignal().find((thread) => thread.id === id) ?? this.threadsSignal()[0] ?? null;
  });

  constructor() {
    effect(() => {
      const authed = this.auth.isAuthenticated();
      untracked(() => {
        if (authed) {
          void this.refresh();
        } else {
          this.threadsSignal.set([]);
          this.selectedIdSignal.set(null);
        }
      });
    });
  }

  async refresh(): Promise<void> {
    try {
      const rows = await firstValueFrom(
        this.http.get<ConversationDto[]>(`${environment.apiUrl}/conversations`)
      );
      const threads = rows.map(toThread);
      this.threadsSignal.set(threads);
      if (!this.selectedIdSignal() && threads[0]) {
        this.selectedIdSignal.set(threads[0].id);
      }
    } catch {
      this.threadsSignal.set([]);
    }
  }

  select(id: string): void {
    this.selectedIdSignal.set(id);
    this.threadsSignal.update((threads) =>
      threads.map((thread) => (thread.id === id ? { ...thread, unread: false } : thread))
    );
  }

  async reply(text: string): Promise<void> {
    const trimmed = text.trim();
    const id = this.selectedIdSignal();
    if (!trimmed || !id) {
      return;
    }
    const row = await firstValueFrom(
      this.http.post<ConversationDto>(`${environment.apiUrl}/conversations/${id}/messages`, {
        message: trimmed,
      })
    );
    const mapped = toThread(row);
    this.threadsSignal.update((threads) => threads.map((thread) => (thread.id === id ? mapped : thread)));
  }
}

function toThread(row: ConversationDto): SellerThread {
  const last = row.messages?.at(-1);
  return {
    id: row.id,
    buyerName: row.buyerName,
    initials: initials(row.buyerName),
    productTitle: row.listingTitle,
    preview: row.preview,
    time: formatTime(row.updatedAt),
    unread: last?.author === 'buyer',
    messages: (row.messages ?? []).map(
      (line, index): SellerChatLine => ({
        id: `${row.id}-${index}`,
        from: line.author === 'seller' ? 'seller' : 'buyer',
        text: line.text,
        time: formatTime(line.createdAt),
      })
    ),
  };
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function formatTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString('de-AT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}
