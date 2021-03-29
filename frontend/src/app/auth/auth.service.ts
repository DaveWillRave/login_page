
import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {UserService} from '../user.service';

@Injectable()
export class AuthService {
  constructor(
    public user: UserService
  ) {}

  jwtHelper = new JwtHelperService();

  public isAuthenticated(): boolean {
    const token = this.user.getToken();
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }
}
