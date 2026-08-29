import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/pages/landing/landing.component').then(
        (m) => m.LandingComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/landing/pages/landing/landing.component').then(
            (m) => m.EmptyOutletComponent
          ),
      },
      {
        path: 'auth/login',
        loadComponent: () =>
          import('./features/auth/pages/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'auth/register',
        loadComponent: () =>
          import('./features/auth/pages/register/register.component').then(
            (m) => m.RegisterComponent
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
    path: 'anzeigen',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/marketplace/pages/category-listings/category-listings.component').then(
            (m) => m.CategoryListingsComponent
          ),
      },
      {
        path: ':slug',
        loadComponent: () =>
          import('./features/marketplace/pages/category-listings/category-listings.component').then(
            (m) => m.CategoryListingsComponent
          ),
      },
    ],
  },
  {
    path: 'seller',
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
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
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
    ],
  },
];
