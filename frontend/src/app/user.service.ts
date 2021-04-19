import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

// Injectable decorator that makes this service providable application wide.
@Injectable()

/* This exports the user class allowing components to access the Http requests functions
* such as post, get and get token */

export class UserService {
  ROOT_URL = `http://jsonplaceholder.typicode.com`;
  // Constructor initializes the class members of the user service
  constructor(
    private http: HttpClient,
    public router: Router
  ) {}
  // Passes user object into function and posts http request with the username in the url.
  userLogin(user): Observable<any> {
    // console.log('http://127.0.0.1:5000/api', user);
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

    return this.http.get(
      `http://127.0.0.1:5000/api`
      // `${this.ROOT_URL}/posts`
    );
  }
  // Retrieves the token generated from the backend
  public getToken(): string {

    return localStorage.getItem('token');
  }

}

