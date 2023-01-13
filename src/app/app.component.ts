import {Component, OnInit} from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

    topbarTheme = 'blue';

    menuTheme = 'light';

    layoutMode = 'light';

    menuMode = 'static';

    inlineMenuPosition = 'bottom';

    inputStyle = 'filled';

    ripple = true;

    isRTL = false;
    darkMode: boolean;

    constructor(public translate: TranslateService, private primengConfig: PrimeNGConfig) {
        translate.addLangs(['en', 'ar']);
        translate.setDefaultLang('en');
    
        const browserLang = translate.getBrowserLang();
        if(localStorage.getItem('lang')){
            translate.use(localStorage.getItem('lang'));
        }else{
            var lang = browserLang.match(/en|ar/) ? browserLang : 'en';
            translate.use(lang);
            localStorage.setItem('lang', lang);
        }
    }

    ngOnInit() {
        this.primengConfig.ripple = true;
    }
}
