import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Location } from '@angular/common';
import {RouterTestingModule} from '@angular/router/testing';
import { Router } from '@angular/router';
import { appRoutes} from './app-routing';
import {AppModule} from './app.module';
/*
Describes the tests sitting inside.
It contains the tests we want to run
expectation which verifies if this is true or false
*/

describe('AppComponent', () => {
  // tslint:disable-next-line:prefer-const
  let location: Location;
  let router: Router;
  let fixture;
  let app;
  // let component;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(appRoutes),
        AppModule],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    router.initialNavigation();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  /*
  Makes sure the title is set to front end.
   */
  it(`should have as title 'frontend'`, () => {
    expect(app.title).toEqual('frontend');
  });

  it(`should redirect to login`, fakeAsync(() => {
    router.navigate(['']).then(()  => {
      tick();
      expect(location.path()).toBe('/login');
    });
  }));

  /*
  Tests the fake async command used by jasmine along with the tick method to
  ensure asynchronous testing is working as intended.
   */
  it('fakeAsync works', fakeAsync(() => {
    const promise = new Promise(resolve => {
      setTimeout(resolve, 10);
    });
    let done = false;
    promise.then(() => (done = true));
    tick(50);
    expect(done).toBeTruthy();
  }));
});
