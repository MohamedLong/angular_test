import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RandomGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // return this.canLoad();
    if (!this.authService.isLoggedIn()) {
        //console.log(state.url);
        this.router.navigate(['/login']);
      }
      return this.authService.isLoggedIn();


  }

//   canLoad() {
//     console.log(this.authService.isLoggedIn())

//   }
}
