import { Routes, RouterModule, CanActivate } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomepageComponent} from './homepage/homepage.component';
import {
  AuthGuardService as AuthGuard
} from './auth/auth.guard';

// The directories the user can access and which components these directories are associated with.
const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  // Implements an authguard for the /home directory only allowing access if a valid token is in local storage.
  {
    path: 'home',
    component: HomepageComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];

// Assigns the root directory to the routes of the router module.
export const routing = RouterModule.forRoot(appRoutes);
