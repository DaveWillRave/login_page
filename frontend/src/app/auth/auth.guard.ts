import {Injectable} from '@angular/core';
import {CanActivate, Router } from '@angular/router';
import { AuthService} from './auth.service';
import {MatDialog} from '@angular/material/dialog';
import {HomepageComponent} from '../homepage/homepage.component';


@Injectable()
// This guards the routes the user can access, and will only make them accessible if a valid token is provided.
export class AuthGuardService implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    public dialog: MatDialog,
  ) {}

  // This checks if the user token is valid. If not should redirect the user to the login page.
  canActivate(): boolean {
    try {
      if (!this.auth.isAuthenticated()) {
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }
    catch {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
