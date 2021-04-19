import {ComponentFixture, fakeAsync, TestBed, tick, flush} from '@angular/core/testing';
import {MatDialog} from '@angular/material/dialog';
import {UserService} from '../user.service';
import {RouterTestingModule} from '@angular/router/testing';
import {of} from 'rxjs';
import { LoginComponent } from './login.component';
import {DebugElement} from '@angular/core';
import {AppModule} from '../app.module';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let de: DebugElement;
  let spy: jasmine.Spy;
  let el: HTMLElement;
  let userServiceMock: UserService;
  let location: Location;
  let router: Router;

/*
Running this code before each test in this file. Will initialise the login page component and all the modules for html.
 */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        AppModule],
      declarations: [ LoginComponent ],
      providers: [{
        provide: UserService
      },
        {
          provide: MatDialog
        }]
    })
      .compileComponents();
  });
/*
Declaring the variables. Injecting user service for testing requests, router and location for
 navigating to different directories for testing the auth guard.
 */
  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    userServiceMock = de.injector.get(UserService);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  /*
  Will initialize the register pop up overlay in the DOM for testing the register form
   */
  function initOverlay(): void
  {
    const btn = (document.getElementById('overlay-active') as HTMLButtonElement);
    btn.click();
    tick();
  }

/*
Will take username and password as a param and set them to their respective form values in the login form.
 */
  function registerForm(username, password): void
  {
    component.registerform.controls.username.setValue(username);
    component.registerform.controls.password.setValue(password);
    fixture.detectChanges();
  }
  /*
  Will take username and password as a param and set them to their respective form values in the register form.
   */
  function loginForm(username, password): void
  {
    component.loginform.controls.username.setValue(username);
    component.loginform.controls.password.setValue(password);
    fixture.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

/*
Testing the if the login button is disabled as should be for form validation.
 */
  describe('#login-btn', () => {
    it('should test if login button is disabled when the form is invalid -- Required fields are empty', fakeAsync(() => {
      loginForm('', '');
      expect((document.getElementById('login-btn') as HTMLButtonElement).disabled).toBeTruthy();
    }));

    it('should test if login button is enabled when the form is valid -- Required fields are filled', fakeAsync(() => {
      loginForm('12', '123');
      expect((document.getElementById('login-btn') as HTMLButtonElement).disabled).toBeFalsy();
    }));

    it('should test if login button is called when button is enabled and clicked on', fakeAsync(() => {
      spyOn(component, 'onSubmit');
      loginForm('12', '123456');
      (document.getElementById('login-btn') as HTMLButtonElement).click();
      expect(component.onSubmit).toHaveBeenCalledTimes(1);
    }));
  });
  describe('#register-btn', () => {
    /*
  Testing the if the register button is disabled as should be for form validation.
   */
    it('should test if register button is enabled when the form is valid -- Required fields are filled', fakeAsync(() => {
      initOverlay();
      registerForm('12', '123456');
      expect((document.getElementById('register-btn') as HTMLButtonElement).disabled).toBeFalsy();
    }));

    it('should test if register button is called when button is enabled and clicked on', fakeAsync(() => {
      spyOn(component, 'onRegister');
      initOverlay();
      registerForm('12', '123456');
      (document.getElementById('register-btn') as HTMLButtonElement).click();
      expect(component.onRegister).toHaveBeenCalledTimes(1);
    }));

    it('should test if register button is disabled when the form is invalid -- Required fields are invalid', fakeAsync(() => {
      initOverlay();
      registerForm('1x2', '23456');
      expect((document.getElementById('register-btn') as HTMLButtonElement).disabled).toBeTruthy();
    }));

    it('should test if register button is disabled when the form is empty -- Required fields are missing', fakeAsync(() => {
      initOverlay();
      registerForm('', '');
      expect((document.getElementById('register-btn') as HTMLButtonElement).disabled).toBeTruthy();
    }));
  });
  /*
  Running a test to ensure register form is loaded in the DOM.
   */
  it('should run the openWithTemplate event once button is pressed and activate the overlay', fakeAsync(() => {
    spyOn(component, 'openWithTemplate');
    initOverlay();
    expect(component.openWithTemplate).toHaveBeenCalled();
  }));
  describe('#userRegister()', () => {
    /*
    Expecting the register to be called when attempting to register a new user.
     */
    it('should test if onRegister stores user', fakeAsync(() => {
      const json = {test: 'test'};
      spy = spyOn(userServiceMock, 'userRegister').and.returnValue(of(json));
      initOverlay();
      spyOn(window, 'confirm').and.returnValue(true);
      tick(500);
      component.onRegister(undefined);
      expect(spy).toHaveBeenCalled();
    }));
  });
  describe('#userLogin()', () => {
    /*
    Will mock the backend response, expecting to return values confirming the user login
     and will test onLogin function to make sure it stores the token and navigates the user to login as expected.
     */
    it('should test if onLogin logs in the user', fakeAsync(() => {
      const json = {login: true, token: '123'};
      spy = spyOn(userServiceMock, 'userLogin').and.returnValue(of(json));
      component.onSubmit(undefined);
      expect(localStorage.getItem('token')).toBe('123');
      expect(location.path()).toBe('/login');
      expect(spy).toHaveBeenCalled();
      localStorage.clear();
      fixture.detectChanges();
    }));

    /*
  Will mock the backend response, expecting to return values denying the user login
   and will test onLogin function to make sure it rejects the login and stayes in the login component.
   */
    it('should test if onLogin denies invalid user and stays on login page', fakeAsync(() => {
      const json = {login: false};
      spy = spyOn(userServiceMock, 'userLogin').and.returnValue(of(json));
      component.onSubmit(undefined);
      expect(spy).toHaveBeenCalled();
      flush();
    }));

    /*
    Will pass a token and valid user to the onSubmit and expects it to store the token accordingly.
     */
    it('should test if onLogin stores the token in local storage', fakeAsync(() => {
      const json = {login: true, token: '123'};
      spy = spyOn(userServiceMock, 'userLogin').and.returnValue(of(json));
      component.onSubmit(undefined);
      expect(localStorage.getItem('token')).toBe('123');
      localStorage.clear();
      flush();
    }));
  });
});
