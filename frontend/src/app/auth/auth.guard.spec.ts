import { TestBed} from '@angular/core/testing';
import {
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { AuthGuardService } from './auth.guard';
import {RouterTestingModule} from '@angular/router/testing';
import {AuthService} from './auth.service';

import {AppModule} from '../app.module';

import {Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';

describe('AuthGuard', () => {
  let authService: AuthService;
  let guard: AuthGuardService;
  const routerMock = {navigate: jasmine.createSpy('navigate')};

/*
Sets up and configurations for each test that is run. Providing the auth services and importing all the the modules decleared in app.module.ts
 */
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuardService, {provide: Router, useValue: routerMock}, AuthService],
      imports: [HttpClientTestingModule, RouterTestingModule, AppModule]
    });
    authService = TestBed.inject(AuthService);
    guard = TestBed.inject(AuthGuardService);
  });

  /*
  Expecting the auth guard to create.
   */
  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  /*
 Will try to navigate to a route and see if auth guard fires up.
  */
  it('should redirect an unauthenticated user to the login route', () => {
    expect(guard.canActivate()).toEqual(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  /*
  Creating a mock of the auth service to return a value of true for a valid user.
   */
  it('should allow the authenticated user to access app', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    expect(guard.canActivate()).toEqual(true);
  });

  /*
  Token (permanently valid) is set in local storage and is validated. Should retrun true.
   */
  it('checks if particular valid token is recognised as valid', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    expect(guard.canActivate()).toEqual(true);
  });

  /*
  Invalid token is saved in local storage anc verified. Should return false.
   */
  it('checks if particular invalid token is recognised as invalid', () => {
    const token = '123';

    localStorage.setItem('token', token);
    expect(guard.canActivate()).toEqual(false);
    localStorage.clear();
  });

  /*
  Expired token is saved in local storage anc verified. Should return false.
   */
  it('checks if particular expired token is recognised as expired', () => {
    const token =  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaC' +
      'I6ZmFsc2UsImlhdCI6MTYxODU4MzcxOSwianRpIjoiMTFjM2' +
      'U4MWUtMGEzOC00ZDUzLTg3ODktZjA0NDAzNDJiODc1IiwibmJ' +
      'mIjoxNjE4NTgzNzE5LCJ0eXBlIjoiYWNjZXNzIiwic3ViIjoiZ' +
      'G92eSIsImV4cCI6MTYxODU4MzcyMH0._1zR1EpOtCEZeSquEpw' +
      'rTc06VaLz--Kap8DTJodRYQQ';

    localStorage.setItem('token', token);
    expect(guard.canActivate()).toEqual(false);
    localStorage.clear();
  });
});

