import { Component } from '@angular/core';

// Sets the app components meta data
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

// Sets the title of the app as a frontend for the browser tab.
export class AppComponent {
  title = 'frontend';
}
