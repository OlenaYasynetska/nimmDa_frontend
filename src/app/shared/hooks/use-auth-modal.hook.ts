import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';

export interface AuthModal {
  close(): void;
  readonly overlayClass: string;
  readonly backdropClass: string;
  readonly panelClass: string;
}

export function useAuthModal(homeUrl = '/'): AuthModal {
  const router = inject(Router);
  const document = inject(DOCUMENT);
  const destroyRef = inject(DestroyRef);

  document.body.classList.add('overflow-hidden');

  const onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      close();
    }
  };
  document.addEventListener('keydown', onKeydown);

  destroyRef.onDestroy(() => {
    document.removeEventListener('keydown', onKeydown);
    document.body.classList.remove('overflow-hidden');
  });

  function close(): void {
    void router.navigateByUrl(homeUrl);
  }

  return {
    close,
    overlayClass:
      'fixed inset-0 z-[80] flex items-end justify-center overflow-y-auto p-0 sm:items-center sm:p-4',
    backdropClass: 'absolute inset-0 bg-slate-900/50',
    panelClass: 'relative z-10 max-h-[92dvh] w-full max-w-sm overflow-y-auto sm:my-8',
  };
}
