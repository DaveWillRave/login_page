import {Component, OnInit, ViewContainerRef} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { UserService } from '../user.service';
import {FormGroup, FormControl, Validators } from '@angular/forms';
import {Overlay, OverlayConfig} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

// Exports the login components and runs the functions and constructors for this class upon running the app.
export class LoginComponent implements OnInit {

  // Initialising the objects and variables for the login.
  loginform: FormGroup;
  registerform: FormGroup;
  passlength = 6;

// Constructor initializes the class members of the for the login components. Necessary for using any imported modules or services.
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
  ) {
  }

  /* Implements the sign up overlay which runs when the user clicks the sign up button. It pops out the registration from and focuses it.
  Will deselect the form if the background is clicked. Function returns void and takes no parameters.
  */
  openWithTemplate(ref: any): void {
    const configs = new OverlayConfig({
      hasBackdrop: true,
    });
    const overlayRef = this.overlay.create(configs);
    overlayRef.attach(new TemplatePortal(ref, this.viewContainerRef));
    overlayRef.backdropClick().subscribe(() => overlayRef.dispose());
  }

  /* When the on the login directory the form group and form control constructors are assigned to keys.
  Validators are implemented make the input fields requirements before the login button is accessible.
   */
  ngOnInit(): void {
    // A from group for just the login form.
    this.loginform = new FormGroup({
      // id: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
    // Form group for registration form
    this.registerform = new FormGroup({
      username: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('[\\w\\-\\s\\/]+'),
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(this.passlength),
      ])),
    });
  }

  // On submission will send all the values assigned to the keys from the input fields and will user user.servces.ts to validate the credentials.
  onSubmit(user): void {
    let loginStatus;
    console.log(this.userService.userLogin(user));
    this.userService.userLogin(user)
      // lambda expression used to map the boolean response to loginStatus
      .subscribe(response => {
        // will return [object Object] instead of boolean of this is not done
        loginStatus = response.login;

        // Backend will return true or false based on data and this loop will either store the token backend will generate or will print false on console.
        if (loginStatus === true) {
          localStorage.setItem('token', response.token);
          console.log(`Login: ${loginStatus}`);
          this.router.navigate([`/home`]);
        } else {
          console.log(`Login: ${loginStatus}`);
          console.log(loginStatus.response);
        }
      });
  }

  // Will register a new user by passing the registration form and values assigned from html input fields. Will Return a console log and/or redirect.
  onRegister(user): void {
    if (confirm(`Are you sure you want to register this user to the database?`)) {
      this.userService.userRegister(user)
        .subscribe(() => {
          console.log(`Register: Success!`);
          location.reload();
        });
    } else {
      console.log(`User was not registered to the database.`);
    }
  }
}
