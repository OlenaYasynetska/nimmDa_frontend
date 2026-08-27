import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="w-full min-w-0 border-t border-slate-200 bg-white px-6 py-4">
      <p class="text-center text-sm text-slate-500">© {{ year }} NimmDa</p>
    </footer>
  `,
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
