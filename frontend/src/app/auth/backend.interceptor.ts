import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable, Injector} from '@angular/core';
import {Observable, of} from 'rxjs';

/*
This backend interceptor is for testing purposes.
It will create a mock api for testing the user services and interceptors.
 */

const usersData = {
  /*
  User data hard coded into backend in the form of a json for testing purposes. Mimics data structure of actual backend.
   */
  users: [
    {
      _id: '605b0922882b8ff5f812c1f3',
      username: 'Dovy',
      password: '$2b$12$QlqA4noPR/jnmnKmX2lWTOdW1i3PhN.FFP9eBa.9Us0Qcijw8PGJO'
    },
    {
      _id: '605b091a882b8ff5f812c1f2',
      username: 'Renan',
      password: '$2b$12$3qqexDUsrdL6orxkqnSQF.0/mnhfrl5PKNyhsCw2dtTebdN2S9Wc.'
    },
    {
      _id: '605b0913882b8ff5f812c1f1',
      username: 'Dylan',
      password: '$2b$12$CpVl1FeiA.cmuE8/J5VnWuewT9pSkFB3ndLE3MrmqNjhqyEOCCAd.'
    }
  ]
};

@Injectable()
export class BackendInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) {}
/*
Searches the database and passes two params to it. Should return a string that will be used in the if statements in the intercept function.
 */
  searchDb(username, password): string{
    for (const user of usersData.users){
      if (user.username === username){
        if (user.password === password){
          return 'success';
        }else {
          return 'wrong_pass';
        }
      }
    }
    return 'wrong_user';
  }

  /*
  Should intercept any request made from user services and fire up the fake api backend.
  Should only intercept when testing is done, and will not intercept during normal application runtime.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    if (request.method === 'GET' && request.url === 'http://127.0.0.1:5000/api'){
      return of(new HttpResponse({status: 200, body: usersData}));
    }

    else if (request.method === 'POST'){
      /*
      Creating mock responses for the post method when attempting to login in an exiting user.
      Also creating some edge case scenerios for incorrect login information.
       */
      const responses = {
        success: {
          message: 'Login Successful',
          login: true,
          access_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTYxODM5MDMwOSwianRpI' +
            'joiY2FkYjlmYjEtNzllNi00ZjQ5LWFhOTktMDJlYjM0ZDAxMzYzIiwibmJmIjoxNjE4MzkwMzA5LCJ0eXBlIjoiYWNjZXNz' +
            'Iiwic3ViIjoicmVuYW5AZGVsbC5jb20iLCJleHAiOjE2MjM1NzQzMDl9.wEqyRHj-PiRPtYIAAo4ulAL2TTy27ytrPFPd7H' +
            'fqrqs',
          code: 201
        },
        wrong_pass: {
          message: 'Password is wrong!',
          login: false,
          code: 401
        },
        wrong_user: {
          message: 'User does not exist',
          login: false,
          code: 401
        },
        error: {
          message: 'An error has occurred',
          login: false,
          code: 406
        }
      };
      /*
      Sends username and password as a parameter and expects a string in return.
       */
      const loginCheck = this.searchDb(request.body.username, request.body.password);

      // Will return the string response from login check.
      return of(new HttpResponse({body: {response: responses[loginCheck]}}));
    }
    next.handle(request);
  }
}
