import {Injectable, Injector} from '@angular/core';
import { Observable } from 'rxjs';
import {HttpBackend, HttpClient, HttpHeaders} from '@angular/common/http';
// import {TokenInterceptor} from './auth/token.interceptor';




@Injectable({
  providedIn: 'root'
})


export class UserService {
  private http: HttpClient;
  constructor(httpBackend: HttpBackend) {
    this.http = new HttpClient(httpBackend);
  }

  userLogin(user): Observable<any> {
    console.log('http://127.0.0.1:5000/api', user);
    return this.http.post(
      `http://127.0.0.1:5000/api/${user.username}`,
      user
    );
  }

  userRegister(user): Observable<any> {
    console.log('http://127.0.0.1:5000/api', user);
    return this.http.post(
      `http://127.0.0.1:5000/api/`,
      user
    );
  }

  auth(token): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
    console.log('http://127.0.0.1:5000/#/auth');
    return this.http.get(
      `http://127.0.0.1:5000/auth`,
      httpOptions
    );
  }
}

export class AuthService {
  public getToken(): string {
    console.log('Using intercept');
    return localStorage.getItem('token');
  }
}
