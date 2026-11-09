import { DestroyRef, afterNextRender, computed, inject, signal } from '@angular/core';

const LISTING_ROWS_PER_PAGE = 3;

function columnsForWidth(width: number): number {
  if (width >= 1280) {
    return 4;
  }
  if (width >= 1024) {
    return 3;
  }
  if (width >= 640) {
    return 2;
  }
  return 1;
}

export function useListingPageSize() {
  const columns = signal(4);
  const destroyRef = inject(DestroyRef);

  afterNextRender(() => {
    const apply = (): void => {
      const next = columnsForWidth(window.innerWidth);
      if (next !== columns()) {
        columns.set(next);
      }
    };
    apply();
    let frame = 0;
    const onResize = (): void => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(apply);
    };
    window.addEventListener('resize', onResize);
    destroyRef.onDestroy(() => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
    });
  });

  return computed(() => columns() * LISTING_ROWS_PER_PAGE);
}
