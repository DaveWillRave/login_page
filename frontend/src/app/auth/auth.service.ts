
import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {UserService} from '../user.service';


@Injectable()

// This service is for checking if the user token is valid.
export class AuthService {
  constructor(
    public user: UserService
  ) {}

  // Instance of JWTHelperService here instead of in constructor as only the decode feature is utilised.
  jwtHelper = new JwtHelperService();

  // Function for checking token validity.
  public isAuthenticated(): boolean {
    const token = this.user.getToken();
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }
}
