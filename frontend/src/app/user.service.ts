import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

// Injectable decorator that makes this service providable application wide.
@Injectable({
  providedIn: 'root',
})

/* This exports the user class allowing components to access the Http requests functions
* such as post, get and get token */

export class UserService {
  // Constructor initializes the class members of the user service
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
  // Registers users by passing users username attached to the http request to the backend
  userRegister(user): Observable<any> {
    console.log('http://127.0.0.1:5000/api', user);
    return this.http.post(
      `http://127.0.0.1:5000/api/`,
      user
    );
  }
  // Gets all the current users registered in the database
  getUsers(): Observable<any> {
    console.log('http://127.0.0.1:5000/api');
    return this.http.get(
      `http://127.0.0.1:5000/api/`
    );
  }
  // Retrieves the token generated from the backend
  public getToken(): string {
    console.log('Using intercept');
    return localStorage.getItem('token');
  }

}

