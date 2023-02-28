import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['']);
    }
    console.log(this.authService.isLoggedIn());
    return !this.authService.isLoggedIn();
  }

  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): boolean {
  //   if (this.authService.isLoggedIn()) {
  //     return true;
  //   } else {
  //     localStorage.setItem('redirectUrl', state.url);
  //     this.router.navigate(['/login']);
  //     return false;
  //   }
  // }
}
