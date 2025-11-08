import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'applications',
    loadComponent: () => import('./components/application-list/application-list.component').then(m => m.ApplicationListComponent)
  },
  {
    path: 'applications/:id',
    loadComponent: () => import('./components/application-detail/application-detail.component').then(m => m.ApplicationDetailComponent)
  },
  {
    path: 'shared-components',
    loadComponent: () => import('./components/shared-components/shared-components.component').then(m => m.SharedComponentsComponent)
  },
  {
    path: 'technologies',
    loadComponent: () => import('./components/technology-overview/technology-overview.component').then(m => m.TechnologyOverviewComponent)
  },
  {
    path: 'repositories',
    loadComponent: () => import('./components/repository-list/repository-list.component').then(m => m.RepositoryListComponent)
  },
  {
    path: 'repositories/:id',
    loadComponent: () => import('./components/repository-detail/repository-detail.component').then(m => m.RepositoryDetailComponent)
  }
];
