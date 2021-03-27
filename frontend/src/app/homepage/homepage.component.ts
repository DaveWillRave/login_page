import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {UserService} from '../user.service';
import { AuthService } from '../user.service';
import {FormGroup} from '@angular/forms';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  form: FormGroup;

  constructor(
    private userService: UserService,
    // private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,

  ) {}

  ngOnInit(): void {
    let authStatus = false;
    const tokenAuth = localStorage.getItem('token');

    if (tokenAuth == null) {
      console.log(`Token invalid`);
      authStatus = false;
      this.router.navigate(['/login']).then();
    }else{
      // console.log(this.userService.auth(tokenAuth))
      this.userService.auth(tokenAuth)
        //  arrow function used to map the boolean response to authStatus
        .subscribe( response => {
          // will return [object Object] instead of boolean of this is not done
          authStatus = response.token;
          console.log(`auth: ${authStatus}`);
          if (authStatus === true ){
            console.log('User logged in!');
          }
          if ( authStatus === false){
            this.router.navigate(['/login']).then();
          }
        });
    }
  }

  onClick(): void{
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
