import { Component, OnDestroy } from '@angular/core';
import { AppBreadcrumbService } from './app.breadcrumb.service';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { AuthService } from './auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './app.breadcrumb.component.html'
})
export class AppBreadcrumbComponent implements OnDestroy {

    subscription: Subscription;

    items: MenuItem[];

    home: MenuItem;

    constructor(public breadcrumbService: AppBreadcrumbService, private authService: AuthService, 
        private router: Router) {
        this.subscription = breadcrumbService.itemsHandler.subscribe(response => {
            // console.log(response)
            this.items = response;
        });


        this.home = { icon: 'pi pi-home', routerLink: '/' };
    }

    doLogout(){

        this.authService.doLogoutUser();
        this.router.navigate(['/login']);
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
