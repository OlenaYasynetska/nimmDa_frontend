import { Component, computed, input } from '@angular/core';

export interface SellerTrendSeries {
  views: number[];
  inquiries: number[];
  sales: number[];
}

export function emptySellerTrend(days = 30): SellerTrendSeries {
  const zeros = Array.from({ length: days }, () => 0);
  return { views: zeros, inquiries: zeros, sales: zeros };
}

@Component({
  selector: 'app-seller-trend-chart',
  standalone: true,
  template: `
    <div class="relative h-40 w-full">
      <div class="h-full w-full rounded-xl bg-slate-50 ring-1 ring-slate-100" data-chart-host></div>
      @if (!hasData()) {
        <p class="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-slate-400">
          Noch keine Statistik für die letzten 30 Tage.
        </p>
      }
    </div>
  `,
})
export class SellerTrendChartComponent {
  readonly series = input.required<SellerTrendSeries>();

  readonly hasData = computed(() => {
    const data = this.series();
    return [...data.views, ...data.inquiries, ...data.sales].some((value) => value > 0);
  });
}
