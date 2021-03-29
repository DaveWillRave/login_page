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
export class TokenInterceptor implements HttpInterceptor {
  constructor(public user: UserService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.user.getToken()}`
      }
    });
    return next.handle(req);
  }
}
