import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Auth } from './pages/auth/auth';
import { Profile } from './pages/profile/profile';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'MonkeyWeather'
  },
  {
    path: 'auth',
    component: Auth,
    title: 'Login / Register'
  },
  {
    path: 'profile',
    component: Profile,
    title: 'Profile'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
