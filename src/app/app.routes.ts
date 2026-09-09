import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
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
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/buyer/layout/buyer-layout.component').then((m) => m.BuyerLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/buyer/pages/buyer-home/buyer-home.component').then(
            (m) => m.BuyerHomeComponent
          ),
      },
      {
        path: 'nachrichten',
        loadComponent: () =>
          import('./features/seller/pages/seller-messages/seller-messages.component').then(
            (m) => m.SellerMessagesComponent
          ),
      },
    ],
  },
  {
    path: 'seller',
    canActivate: [authGuard, roleGuard(['seller', 'both'])],
    loadComponent: () =>
      import('./features/seller/layout/seller-layout.component').then(
        (m) => m.SellerLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/seller/pages/seller-dashboard/seller-dashboard.component').then(
            (m) => m.SellerDashboardComponent
          ),
      },
      {
        path: 'listings/new',
        loadComponent: () =>
          import('./features/seller/pages/create-listing/create-listing.component').then(
            (m) => m.CreateListingComponent
          ),
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./features/seller/pages/seller-messages/seller-messages.component').then(
            (m) => m.SellerMessagesComponent
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
