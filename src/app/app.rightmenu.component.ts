import {Component} from '@angular/core';
import { AppComponent } from './app.component';
import {AppMainComponent} from './app.main.component';
import { XgarageComponent } from './xgarage/xgarage.component';

@Component({
    selector: 'app-rightmenu',
    templateUrl: './app.rightmenu.component.html'
})
export class AppRightMenuComponent {
    constructor(public appMain: XgarageComponent, public app: AppComponent) {}
}
