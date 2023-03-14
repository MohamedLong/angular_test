import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    // canActivate() {
    //   if (this.authService.isLoggedIn()) {
    //     this.router.navigate(['']);
    //   }
    //   console.log(this.authService.isLoggedIn());
    //   return !this.authService.isLoggedIn();
    // }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        const isLoggedIn = this.authService.isLoggedIn();
        const isLoginPage = state.url.includes('/login');
        // const isRedirect = state.url.includes('redirect');
       // console.log(state)

        if (isLoggedIn) {
            return true;
        }

        if (!isLoginPage) {
            this.router.navigate(['/login'], { queryParams: { destination: state.url } });
            console.log(state.url)
        }

        return false;
    }

}
