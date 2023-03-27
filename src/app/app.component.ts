import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { AuthService } from './auth/services/auth.service';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

    topbarTheme = 'white';

    menuTheme = 'light';

    layoutMode = 'light';

    menuMode = 'static';

    inlineMenuPosition = 'bottom';

    inputStyle = 'filled';

    ripple = true;

    isRTL = false;
    darkMode: boolean;
    previousUrl: any;
    currentUrl: any;

    constructor(private route: ActivatedRoute, public translate: TranslateService, private primengConfig: PrimeNGConfig, private router: Router, private authService: AuthService) {
        translate.addLangs(['en', 'ar']);
        translate.setDefaultLang('en');

        const browserLang = translate.getBrowserLang();
        translate.currentLang = "";
        if (localStorage.getItem('lang')) {
            translate.use(localStorage.getItem('lang'));
        } else {
            var lang = browserLang.match(/en|ar/) ? browserLang : 'en';
            translate.use(lang);
            localStorage.setItem('lang', lang);
        }

    }

    ngOnInit() {
        this.primengConfig.ripple = true;

        this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
            //console.log(event)
            this.previousUrl = this.currentUrl;
            this.currentUrl = event.url;

            if ((this.previousUrl == undefined || this.previousUrl.includes('destination')) && this.route.snapshot.queryParams['id']) {
                // console.log(this.previousUrl.includes('destination'))
                if (this.currentUrl.includes('job-details')) {
                    console.log('redirecting to job details..')
                    localStorage.setItem('jobId', this.route.snapshot.queryParams['id']);
                    this.router.navigate(
                        ['job-details'],
                        { relativeTo: this.route, queryParams: {} }
                    );
                } else if (this.currentUrl.includes('order-details')) {
                    console.log('redirecting to order details..')
                    this.router.navigate(
                        ['orders'],
                        { relativeTo: this.route, queryParamsHandling: 'preserve' }
                    );
                }

            }
        });


        window.addEventListener('storage', () => {
            let token = localStorage.getItem('JWT_TOKEN');
            if (!token) {
                this.authService.logout();
                this.router.navigate(['/login'])
            }
        })
    }


}
