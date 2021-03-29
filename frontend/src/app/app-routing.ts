import { Routes, RouterModule, CanActivate } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomepageComponent} from './homepage/homepage.component';
import {
  AuthGuardService as AuthGuard
} from './auth/auth.guard';


const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: HomepageComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];

export const routing = RouterModule.forRoot(appRoutes);
