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
export class LoginComponent implements OnInit {

  loginform: FormGroup;
  registerform: FormGroup;
  passlength = 6;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private overlay: Overlay, private viewContainerRef: ViewContainerRef
  ) {
  }

  openWithTemplate(ref: any): void {
    const configs = new OverlayConfig({
      hasBackdrop: true,
    });
    const overlayRef = this.overlay.create(configs);
    overlayRef.attach(new TemplatePortal(ref, this.viewContainerRef));
    overlayRef.backdropClick().subscribe(() => overlayRef.dispose());
  }

  ngOnInit(): void {

    this.loginform = new FormGroup({
      // id: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });

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

  onSubmit(user): void {
    let loginStatus;
    console.log(this.userService.userLogin(user));
    this.userService.userLogin(user)
      // lambda expression used to map the boolean response to loginStatus
      .subscribe(response => {
        // will return [object Object] instead of boolean of this is not done
        loginStatus = response.login;
        if (loginStatus === true) {
          localStorage.setItem('token', response.token);
          console.log(`Login: ${loginStatus}`);
          // this.router.navigate([`/home/${response.token}`]);
          this.router.navigate([`/home`]);
        } else {
          console.log(`Login: ${loginStatus}`);
          console.log(loginStatus.response);
        }
      });
  }

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
