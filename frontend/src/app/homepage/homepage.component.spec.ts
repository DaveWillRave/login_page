import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { HomepageComponent } from './homepage.component';
import {DebugElement} from '@angular/core';
import {of} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {UserService} from '../user.service';
import {RouterTestingModule} from '@angular/router/testing';
import {AppModule} from '../app.module';
// import 'rxjs/add/observable/of';

/*
Describes the tests sitting inside.
It contains the tests we want to run
expectation which verifies if this is true or false
*/

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  // fixture is the test environment for component
  let fixture: ComponentFixture<HomepageComponent>;
  // debug element for rendered html
  let de: DebugElement;
  let spy: jasmine.Spy;
  let userServiceMock: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Running a test of the component itself.
      imports: [RouterTestingModule,  AppModule],
      declarations: [ HomepageComponent],
      providers: [{
        provide: UserService
      },
        {
          provide: MatDialog
        }]
    })
      // if you want to compile the components css and html
      .compileComponents();
  });

  // Variables used for testing, with hardcoded json used to verify the response of tested methods.
  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    const json = [{username: 'dave', password: '123'}, {username: 'vlad', password: 'abc'}];
    userServiceMock = de.injector.get(UserService);
    spy = spyOn(userServiceMock, 'getUsers').and.returnValue(of(json));
    fixture.detectChanges();
  });

  it('should create', () => {
    /*  Truthy something evaluates to truth in boolean context,
     the thing being tested doesn't actually return true.
     Known as a jasmine matcher.
     eg: expect() + toContain, toBe
     */
    expect(component).toBeTruthy();
  });

  it('should run ngOnInit', () => {
    expect(component.ngOnInit).toBeTruthy();
  });

  /*
  Running the logout button html and expecting the appropriate text to render.
   */
  it('should run `Logout` button and display it', () => {
    const btn = (document.getElementById('logout-btn') as HTMLButtonElement);
    expect(btn.textContent).toBe('Logout');
  });

  /*
  Checking the onClick function to see of it responds to user input.
   */
  it('should run the onClick event once button is pressed', fakeAsync(() => {
    spyOn(component, 'onClick');
    let btn = (document.getElementById('logout-btn') as HTMLButtonElement);
    btn.click();
    expect(component.onClick).toHaveBeenCalled();
  }));

  it('should run the onClick event once button is pressed', (() => {
    component.onClick();
    expect(component.test).toBe(true);
  }));

  /*
  Runs a mock of the get request in user services and is expecting to retrieve the dummy data declared
  in json format declared in this file.
   */
  it('should run getUsers one time and display the number of users (should be 2 users).', () => {
    expect(spy).toHaveBeenCalled();
    expect( spy.calls.all().length).toEqual(1);
    expect(component.usernames).toEqual(2);
  });


});
