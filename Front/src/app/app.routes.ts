import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        redirectTo: '/publications',
        pathMatch: 'full'
    },
    {
        path: 'publications',
        loadComponent: () => import('./pages/publications/publications').then(m => m.Publications)
    },
    {
        path: 'auth',
        loadComponent: () => import('./pages/auth/auth').then(m => m.Auth)
    },
    {
        path: 'my-profile',
        loadComponent: () => import('./pages/my-profile/my-profile').then(m => m.MyProfile)
    },
    {
        path: '**',
        loadComponent: () => import('./pages/publications/publications').then(m => m.Publications)
    }
];
