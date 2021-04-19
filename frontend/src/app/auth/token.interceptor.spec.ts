import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from '../user.service';
import { AuthGuardService } from './auth.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {AuthService} from './auth.service';
import {MatDialog} from '@angular/material/dialog';
import {AppModule} from '../app.module';
import {TokenInterceptor} from './token.interceptor';

describe(`AuthHttpInterceptor`, () => {
  let service: UserService ;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, AppModule],
      providers: [
        UserService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        },
        AuthService,
        MatDialog
      ],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should add an Authorization header and return bearer to the getUsers request', fakeAsync(() => {
    service.getUsers()
      .subscribe(response => {
        expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne(`http://127.0.0.1:5000/api`);
    expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
    localStorage.clear();
    tick(100);
    expect(httpRequest.request.headers.get('Authorization')).toBe('Bearer null');
  }));

  it('should add an Authorization header and return bearer to the userLogin post request', fakeAsync(() => {
    service.userLogin('Tom')
      .subscribe(response => {
        expect(response).toBeTruthy();
      });

    const httpRequest = httpMock.expectOne(`http://127.0.0.1:5000/api/undefined`);
    expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
    localStorage.clear();
    tick(100);
    expect(httpRequest.request.headers.get('Authorization')).toBe('Bearer null');
  }));

  it('should add an Authorization header and return bearer to the register user post', fakeAsync(() => {
    service.userRegister(undefined)
      .subscribe(response => {
        expect(response).toBeTruthy();
      });

    const httpRequest = httpMock.expectOne(`http://127.0.0.1:5000/api/`);
    expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
    localStorage.clear();
    tick(100);
    expect(httpRequest.request.headers.get('Authorization')).toBe('Bearer null');
  }));

});

