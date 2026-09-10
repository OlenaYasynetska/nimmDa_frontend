import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-konto-profile',
  standalone: true,
  template: `
    <section class="rounded-2xl bg-white p-5 shadow-sm">
      <h2 class="text-lg font-bold text-slate-800">Profil</h2>
      <p class="mt-1 text-sm text-slate-500">So erscheint dein Konto auf NimmDa.</p>
      <dl class="mt-5 space-y-3 text-sm">
        <div>
          <dt class="text-slate-500">Name</dt>
          <dd class="font-medium text-slate-800">{{ displayName }}</dd>
        </div>
        <div>
          <dt class="text-slate-500">E-Mail</dt>
          <dd class="font-medium text-slate-800">{{ user?.email }}</dd>
        </div>
      </dl>
    </section>
  `,
})
export class KontoProfileComponent {
  private readonly auth = inject(AuthService);

  get user() {
    return this.auth.currentUser();
  }

  get displayName(): string {
    const user = this.user;
    if (!user) {
      return 'Mitglied';
    }
    return [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;
  }
}
