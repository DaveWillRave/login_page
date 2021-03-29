import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class UserService {
  constructor(
    private http: HttpClient,
    public router: Router
  ) {}

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

  getUsers(): Observable<any> {
    console.log('http://127.0.0.1:5000/api');
    return this.http.get(
      `http://127.0.0.1:5000/api/`
    );
  }

  public getToken(): string {
    console.log('Using intercept');
    return localStorage.getItem('token');
  }

}

