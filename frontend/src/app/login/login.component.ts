import {Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { UserService } from '../user.service';
import {FormGroup, FormControl, Validators } from '@angular/forms';
import {FocusMonitor, FocusOrigin} from '@angular/cdk/a11y';
import {Observable} from 'rxjs';
import {MatInput} from '@angular/material/input';
import {map} from 'rxjs/operators';
import {Overlay, OverlayConfig, OverlayModule} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  personData;
  id;
  isOpen: boolean;
  form: FormGroup;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private overlay: Overlay, private viewContainerRef: ViewContainerRef
  ) {
  }


  // openWithTemplate(reg: TemplateRef<any>) {
  //   const configs = new OverlayConfig({
  //     hasBackdrop: true,
  //     panelClass: ['modal', 'is-active'],
  //     backdropClass: 'modal-background'
  //   });
  // }

  openWithTemplate(ref: any): void {
    const configs = new OverlayConfig({
      hasBackdrop: true,
    });
    const overlayRef = this.overlay.create(configs);
    overlayRef.attach(new TemplatePortal(ref, this.viewContainerRef));
    overlayRef.backdropClick().subscribe(() => overlayRef.dispose());
  }

  ngOnInit(): void {

    this.form = new FormGroup({
      // id: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
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
    this.userService.userRegister(user)
      // lambda expression used to map the boolean response to loginStatus
      .subscribe(() => {
        // will return [object Object] instead of boolean of this is not done
        console.log(`Register: Success!`);
        location.reload();
      });
  }
}
