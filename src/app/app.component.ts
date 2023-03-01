import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import {Component, OnInit} from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './auth/services/auth.service';
import { Subscription } from 'rxjs';
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

        // let subscription: Subscription = this.router.events.subscribe((val) => {
        //     // let job
        //     console.log(val)
        //     //this.originalUrl = val.url;
        //     subscription.unsubscribe();
        //   });

    }

    ngOnInit() {
        //console.log('init')
        // if (this.route.snapshot.queryParams['id']) {
        //     console.log('there is an id')
        // }
        this.primengConfig.ripple = true;
    }
}
