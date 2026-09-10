import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { redirectAdminGuard } from './core/guards/redirect-admin.guard';
import { roleGuard } from './core/guards/role.guard';

const loadLanding = () =>
  import('./features/landing/pages/landing/landing.component').then((m) => m.LandingComponent);

const loadEmptyOutlet = () =>
  import('./features/landing/pages/landing/landing.component').then((m) => m.EmptyOutletComponent);

const loadCategoryListings = () =>
  import('./features/marketplace/pages/category-listings/category-listings.component').then(
    (m) => m.CategoryListingsComponent
  );

const loadListingDetail = () =>
  import('./features/marketplace/pages/listing-detail/listing-detail.component').then(
    (m) => m.ListingDetailComponent
  );

export const routes: Routes = [
  {
    path: 'anzeigen/artikel/:id',
    loadComponent: loadListingDetail,
  },
  {
    path: 'services',
    loadComponent: loadCategoryListings,
    data: { listingFilter: 'services' },
  },
  {
    path: 'kostenlos',
    loadComponent: loadCategoryListings,
    data: { listingFilter: 'kostenlos' },
  },
  {
    path: 'anzeigen',
    pathMatch: 'full',
    loadComponent: loadCategoryListings,
  },
  {
    path: 'anzeigen/:slug',
    loadComponent: loadCategoryListings,
  },
  {
    path: '',
    loadComponent: loadLanding,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: loadEmptyOutlet,
      },
      {
        path: 'auth/login',
        loadComponent: () =>
          import('./features/auth/pages/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'auth/register',
        loadComponent: () =>
          import('./features/auth/pages/register/register.component').then(
            (m) => m.RegisterComponent
          ),
      },
      {
        path: 'auth/forgot-password',
        loadComponent: () =>
          import('./features/auth/pages/forgot-password/forgot-password.component').then(
            (m) => m.ForgotPasswordComponent
          ),
      },
      {
        path: 'auth/check-email',
        loadComponent: () =>
          import('./features/auth/pages/check-email/check-email.component').then(
            (m) => m.CheckEmailComponent
          ),
      },
      {
        path: 'auth/verify',
        loadComponent: () =>
          import('./features/auth/pages/verify-email/verify-email.component').then(
            (m) => m.VerifyEmailComponent
          ),
      },
      {
        path: 'auth/verify-email',
        loadComponent: () =>
          import('./features/auth/pages/verify-email/verify-email.component').then(
            (m) => m.VerifyEmailComponent
          ),
      },
      {
        path: 'auth/reset-password',
        loadComponent: () =>
          import('./features/auth/pages/reset-password/reset-password.component').then(
            (m) => m.ResetPasswordComponent
          ),
      },
    ],
  },
  {
    path: 'auth',
    pathMatch: 'full',
    redirectTo: 'auth/login',
  },
  {
    path: 'konto',
    canActivate: [authGuard, redirectAdminGuard],
    loadComponent: () =>
      import('./features/konto/layout/konto-layout.component').then((m) => m.KontoLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/konto/pages/konto-overview/konto-overview.component').then(
            (m) => m.KontoOverviewComponent
          ),
      },
      {
        path: 'nachrichten',
        loadComponent: () =>
          import('./features/seller/pages/seller-messages/seller-messages.component').then(
            (m) => m.SellerMessagesComponent
          ),
      },
      {
        path: 'meine-anzeigen',
        pathMatch: 'full',
        redirectTo: 'meine-anzeigen/aktiv',
      },
      {
        path: 'meine-anzeigen/:filter',
        loadComponent: () =>
          import('./features/konto/pages/konto-listings/konto-listings.component').then(
            (m) => m.KontoListingsComponent
          ),
      },
      {
        path: 'anzeige-neu',
        loadComponent: () =>
          import('./features/seller/pages/create-listing/create-listing.component').then(
            (m) => m.CreateListingComponent
          ),
      },
      {
        path: 'favoriten',
        loadComponent: () =>
          import('./features/konto/pages/konto-favorites/konto-favorites.component').then(
            (m) => m.KontoFavoritesComponent
          ),
      },
      {
        path: 'profil',
        loadComponent: () =>
          import('./features/konto/pages/konto-profile/konto-profile.component').then(
            (m) => m.KontoProfileComponent
          ),
      },
      {
        path: 'einstellungen',
        loadComponent: () =>
          import('./features/konto/pages/konto-settings/konto-settings.component').then(
            (m) => m.KontoSettingsComponent
          ),
      },
    ],
  },
  {
    path: 'seller/listings/new',
    redirectTo: 'konto/anzeige-neu',
  },
  {
    path: 'seller/messages',
    redirectTo: 'konto/nachrichten',
  },
  {
    path: 'seller',
    redirectTo: 'konto',
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['admin'])],
    loadComponent: () =>
      import('./features/admin/layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/admin/pages/admin-dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent
          ),
      },
      {
        path: 'sellers',
        data: { kind: 'sellers' },
        loadComponent: () =>
          import('./features/admin/pages/admin-people/admin-people.component').then(
            (m) => m.AdminPeopleComponent
          ),
      },
      {
        path: 'buyers',
        data: { kind: 'buyers' },
        loadComponent: () =>
          import('./features/admin/pages/admin-people/admin-people.component').then(
            (m) => m.AdminPeopleComponent
          ),
      },
      {
        path: 'payments',
        data: { kind: 'payments' },
        loadComponent: () =>
          import('./features/admin/pages/admin-empty-list/admin-empty-list.component').then(
            (m) => m.AdminEmptyListComponent
          ),
      },
      {
        path: 'ads',
        data: { kind: 'ads' },
        loadComponent: () =>
          import('./features/admin/pages/admin-empty-list/admin-empty-list.component').then(
            (m) => m.AdminEmptyListComponent
          ),
      },
      {
        path: 'subscriptions',
        data: { kind: 'subscriptions' },
        loadComponent: () =>
          import('./features/admin/pages/admin-empty-list/admin-empty-list.component').then(
            (m) => m.AdminEmptyListComponent
          ),
      },
    ],
  },
  {
    path: '404',
    loadComponent: () =>
      import('./features/errors/pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/errors/pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
