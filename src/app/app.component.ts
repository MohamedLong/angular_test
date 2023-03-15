import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import {Component, OnInit} from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

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

    constructor(private route: ActivatedRoute, public translate: TranslateService, private primengConfig: PrimeNGConfig, private router: Router) {
        translate.addLangs(['en', 'ar']);
        translate.setDefaultLang('en');

        const browserLang = translate.getBrowserLang();
        if(localStorage.getItem('lang')){
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

            // /console.log(this.previousUrl)
            if ((this.previousUrl == undefined || this.previousUrl.includes('destination')) && this.route.snapshot.queryParams['id']) {
                localStorage.setItem('jobId', this.route.snapshot.queryParams['id']);
                this.router.navigate(
                    ['job-details'],
                    { relativeTo: this.route, queryParams: {  } }
                  );
            }
        });
    }


}
