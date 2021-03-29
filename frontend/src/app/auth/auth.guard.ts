import {Injectable} from '@angular/core';
import {CanActivate, Router } from '@angular/router';
import { AuthService} from './auth.service';
import {MatDialog} from '@angular/material/dialog';
import {HomepageComponent} from '../homepage/homepage.component';


@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    public dialog: MatDialog,
  ) {}

  canActivate(): boolean {
    try {
      if (!this.auth.isAuthenticated()) {
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }
    catch {
    }
  }
}
