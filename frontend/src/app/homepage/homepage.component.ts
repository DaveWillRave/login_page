import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {UserService} from '../user.service';
import {MatDialog} from '@angular/material/dialog';

// Using the angular decorator once again sets the homepage meta data.
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  usernames;
  test = false;
  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,

  ) {}

  // On going to the homepage will do a get request to retrieve all the current users in the database and return a integer.
  ngOnInit(): void {

    const result = this.userService.getUsers()
      .subscribe(response => {
        this.usernames = response.length;
    });
    // console.log(result);
  }

  // A logout button which will remove the current user token on local storage and redirect to the login page.
  onClick(): void{
    this.test = true;
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
