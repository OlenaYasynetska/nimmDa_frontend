import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export function roleGuard(allowedRoles: string[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const user = auth.currentUser();
    if (!user) {
      void router.navigate(['/auth/login']);
      return false;
    }
    if (user.role && allowedRoles.includes(user.role)) return true;
    void router.navigate([auth.homePath()]);
    return false;
  };
}
