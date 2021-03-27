import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomepageComponent} from './homepage/homepage.component';


const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: `home`, component: HomepageComponent}
];

export const routing = RouterModule.forRoot(appRoutes);
