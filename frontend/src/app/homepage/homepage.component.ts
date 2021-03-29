import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {UserService} from '../user.service';
// import { AuthService } from '../user.service';
import {FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  form: FormGroup;
  usernames;
  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,

  ) {}

  ngOnInit(): void {
    const result = this.userService.getUsers()
      .subscribe(response => {
        this.usernames = response.length;
    });
    console.log(result);
  }

  onClick(): void{
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
