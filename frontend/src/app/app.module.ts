import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { routing } from './app-routing';
import { LoginComponent } from './login/login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import { HomepageComponent } from './homepage/homepage.component';
import { OverlayModule } from '@angular/cdk/overlay';
import {TokenInterceptor} from './auth/token.interceptor';
import {AuthService} from './auth/auth.service';
import {UserService} from './user.service';
import {AuthGuardService} from './auth/auth.guard';
import {MatDialogModule} from '@angular/material/dialog';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomepageComponent
  ],
  imports: [
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    OverlayModule,
    BrowserModule,
    routing,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDialogModule


  ],
 providers: [
   AuthService,
   UserService,
   AuthGuardService,
   {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
