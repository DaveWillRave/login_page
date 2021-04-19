import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {BackendInterceptor} from './auth/backend.interceptor';
import {UserService} from './user.service';
import {RouterTestingModule} from '@angular/router/testing';

describe('AuthService', () => {
  let injector: TestBed;
  let service: UserService;
  let httpMock: HttpTestingController;

  /*
  Will set up the testbed before each test. Will proide for the interceptor for the fake api tests.
  Injecting user services along with a http mock for mock http requests.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [UserService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: BackendInterceptor,
          multi: true
        }
      ]
    });
    injector = getTestBed();
    service = injector.inject(UserService);
    httpMock = injector.inject(HttpTestingController);
  });

  /*
  After each test will make sure there is no outstanding http requests.
   */
  afterEach(() => {
    httpMock.verify();
  });

  describe('#userCheck()', () => {
    it('should retrieve users', () => {
      /*
      Hard coding all the user data that will be what is expected to be returned from the requests.
       */
      const usersData = {
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

      let responseUsers;
      service.getUsers().subscribe(response => {
        responseUsers = response;
      });
/*
Comparing the data hard coded and the get response and expecting the get the retrieve all the hard coded data.
 */
      expect(responseUsers).toEqual(usersData);
    });
  });

  describe('#checkLogin()', () => {
    /*
    Will pass valid user data to the login user method and expecting the backend interceptor to
    return exactly what is in the expected json response hardcoded in this test.
     */
    it('should check for login success', () => {
      const user = {
        username: 'Renan',
        password: '$2b$12$3qqexDUsrdL6orxkqnSQF.0/mnhfrl5PKNyhsCw2dtTebdN2S9Wc.'
      };

      const expectedResponse = {
        message: 'Login Successful',
        login: true,
        access_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTYxODM5MDMwOSwianRpI' +
          'joiY2FkYjlmYjEtNzllNi00ZjQ5LWFhOTktMDJlYjM0ZDAxMzYzIiwibmJmIjoxNjE4MzkwMzA5LCJ0eXBlIjoiYWNjZXNz' +
          'Iiwic3ViIjoicmVuYW5AZGVsbC5jb20iLCJleHAiOjE2MjM1NzQzMDl9.wEqyRHj-PiRPtYIAAo4ulAL2TTy27ytrPFPd7H' +
          'fqrqs',
        code: 201
      };

      let apiResponse;
      service.userLogin(user).subscribe(response => {
        apiResponse = response.response;
      });

      expect(apiResponse.message).toEqual(expectedResponse.message);
      expect(apiResponse.login).toEqual(expectedResponse.login);
      expect(apiResponse.access_token).toEqual(expectedResponse.access_token);
      expect(apiResponse.code).toEqual(expectedResponse.code);
    });

    it('should check for login fail on wrong password', () => {
      /*
    Will pass invalid user password to the login user method and expecting the backend interceptor to
    return exactly what is in the expected json response hardcoded in this test.
     */
      const expectedResponse = {
        message: 'Password is wrong!',
        login: false,
        code: 401
      };

      const user = {
        username: 'Renan',
        password: 'aaaaa'
      };

      let apiResponse;
      service.userLogin(user).subscribe(response => {
        // console.log(response.response);
        console.log('response of response' + response.response);
        apiResponse = response.response;
      });

      expect(apiResponse.message).toEqual(expectedResponse.message);
      expect(apiResponse.login).toEqual(expectedResponse.login);
      expect(apiResponse.code).toEqual(expectedResponse.code);
    });

    it('should check for login fail on user not found', () => {
      /*
      Will pass invalid user username to the login user method and expecting the backend interceptor to
      return exactly what is in the expected json response hardcoded in this test.
      */
      const user = {
        username: 'Renann',
        password: 'aaaaa'
      };

      const expectedResponse = {
        message: 'User does not exist',
        login: false,
        code: 401
      };

      let apiResponse;
      service.userLogin(user).subscribe(response => {
        console.log(response.response);
        apiResponse = response.response;
      });

      expect(apiResponse.message).toEqual(expectedResponse.message);
      expect(apiResponse.login).toEqual(expectedResponse.login);
      expect(apiResponse.code).toEqual(expectedResponse.code);
    });
  });
});
