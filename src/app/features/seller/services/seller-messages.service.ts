import { Injectable, computed, signal } from '@angular/core';
import { INITIAL_SELLER_THREADS, type SellerThread } from '../data/seller.content';

const THREADS_STORAGE_KEY = 'nimmda.seller.threads';

@Injectable({ providedIn: 'root' })
export class SellerMessagesService {
  private readonly threadsSignal = signal<SellerThread[]>(this.readStoredThreads());
  private readonly selectedIdSignal = signal<string | null>(
    this.readStoredThreads()[0]?.id ?? null
  );

  readonly threads = this.threadsSignal.asReadonly();
  readonly selectedId = this.selectedIdSignal.asReadonly();
  readonly unreadCount = computed(
    () => this.threadsSignal().filter((thread) => thread.unread).length
  );
  readonly selectedThread = computed(() => {
    const id = this.selectedIdSignal();
    return this.threadsSignal().find((thread) => thread.id === id) ?? this.threadsSignal()[0] ?? null;
  });

  select(id: string): void {
    this.selectedIdSignal.set(id);
    this.threadsSignal.update((threads) =>
      threads.map((thread) => (thread.id === id ? { ...thread, unread: false } : thread))
    );
    this.persist();
  }

  reply(text: string): void {
    const trimmed = text.trim();
    const id = this.selectedIdSignal();
    if (!trimmed || !id) {
      return;
    }
    const time = new Date().toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit' });
    this.threadsSignal.update((threads) =>
      threads.map((thread) => {
        if (thread.id !== id) {
          return thread;
        }
        return {
          ...thread,
          unread: false,
          preview: trimmed,
          time,
          messages: [
            ...thread.messages,
            { id: crypto.randomUUID(), from: 'seller' as const, text: trimmed, time },
          ],
        };
      })
    );
    this.persist();
  }

  private persist(): void {
    sessionStorage.setItem(THREADS_STORAGE_KEY, JSON.stringify(this.threadsSignal()));
  }

  private readStoredThreads(): SellerThread[] {
    try {
      const raw = sessionStorage.getItem(THREADS_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SellerThread[]) : INITIAL_SELLER_THREADS;
    } catch {
      return INITIAL_SELLER_THREADS;
    }
  }
}
