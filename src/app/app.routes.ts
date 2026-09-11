import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { redirectAdminGuard } from './core/guards/redirect-admin.guard';
import { roleGuard } from './core/guards/role.guard';
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { categoryListingsMatch } from './features/marketplace/data/listing-route';

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

const loadCreateListing = () =>
  import('./features/seller/pages/create-listing/create-listing.component').then(
    (m) => m.CreateListingComponent
  );

export const routes: Routes = [
  {
    path: 'anzeigen/artikel/:id',
    redirectTo: '/anzeigen/:id',
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
    canMatch: [categoryListingsMatch],
    loadComponent: loadCategoryListings,
  },
  {
    path: 'anzeigen/:id',
    loadComponent: loadListingDetail,
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
      ...AUTH_ROUTES,
    ],
  },
  { path: 'auth/login', redirectTo: '/login' },
  { path: 'auth/register', redirectTo: '/register' },
  { path: 'auth/forgot-password', redirectTo: '/forgot-password' },
  { path: 'auth/check-email', redirectTo: '/check-email' },
  { path: 'auth/verify', redirectTo: '/verify' },
  { path: 'auth/verify-email', redirectTo: '/verify-email' },
  { path: 'auth/reset-password', redirectTo: '/reset-password' },
  {
    path: 'auth',
    pathMatch: 'full',
    redirectTo: '/login',
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
        path: 'favoriten',
        loadComponent: () =>
          import('./features/konto/pages/konto-favorites/konto-favorites.component').then(
            (m) => m.KontoFavoritesComponent
          ),
      },
      {
        path: 'meine-anzeigen/neu',
        loadComponent: loadCreateListing,
      },
      {
        path: 'meine-anzeigen/:id/bearbeiten',
        loadComponent: loadCreateListing,
      },
      {
        path: 'meine-anzeigen/aktiv',
        redirectTo: 'meine-anzeigen',
      },
      {
        path: 'meine-anzeigen',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/konto/pages/konto-listings/konto-listings.component').then(
            (m) => m.KontoListingsComponent
          ),
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
        redirectTo: 'meine-anzeigen/neu',
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
    redirectTo: 'konto/meine-anzeigen/neu',
  },
  {
    path: 'seller/messages',
    redirectTo: 'konto/nachrichten',
  },
  {
    path: 'seller',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/konto',
      },
      {
        path: '**',
        redirectTo: '/konto',
      },
    ],
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
