import {Router, RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { LoginComponent } from './auth/containers/login/login.component';
// import { SignupComponent } from './auth/containers/signup/signup.component';
import { AuthService } from './auth/services/auth.service';

const routes: Routes = [];

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '', loadChildren: () => import('./xgarage/xgarage.module').then(m => m.XgarageModule)},
            { path: 'login', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
            //{path: 'login', component: LoginComponent},
            {path: '**', redirectTo: ''},
        ], {scrollPositionRestoration: 'enabled'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router: Router, private authService: AuthService) {
    if(this.authService.isLoggedIn()) {
        this.authService.getAuthorizedMenu();
    }
  }
}
