import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {UserService} from '../user.service';

@Injectable()

// This class intercepts http requests and ensures a http header is attached with a token. The token is verified in the backend.
export class TokenInterceptor implements HttpInterceptor {
  constructor(public user: UserService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Creates a clone of the request and changes it because the request itself is immutable.
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.user.getToken()}`
      }
    });
    console.log('Using intercept');
    return next.handle(req);
  }
}
