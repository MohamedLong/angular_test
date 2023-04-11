import {Component, OnInit} from '@angular/core';
import {AppComponent} from './app.component';
import { MainMenu } from './xgarage/dashboard/model/mainmenu';
import { UserMainMenuService } from './xgarage/dashboard/service/usermainmenu.service';

@Component({
    selector: 'app-menu',
    template: `
            <!-- <div class="layout-menu-container">
            <ul class="layout-menu" role="menu" (keydown)="onKeydown($event)">
                <li app-menu class="layout-menuitem-category" *ngFor="let item of model; let i = index;" [item]="item" [index]="i" [root]="true" role="none">
                    <div class="layout-menuitem-root-text" [attr.aria-label]="item.pageName">{{item.pageName}}</div>
                    <ul role="menu">
                        <li class="layout-menuitem-category" app-menuitem *ngFor="let child of model" [item]="child" [index]="i" role="none"></li>
                        <li app-menuitem [item]="child" [index]="i" [parentKey]="key" role="none"></li>
                    </ul>
                    <ul role="menu">
			              	<ng-template ngFor let-child let-i="index" [ngForOf]="item.subMenus">
			              		<li app-menuitem [item]="child" [index]="i" [parentKey]="key" role="none"></li>
			              	</ng-template>
			              </ul>
                </li>
            </ul>
        </div>  -->
        <ul class="layout-menu">
            <li app-menuitem *ngFor="let item of model; let i = index;" [item]="item" [index]="i" [root]="true"></li>
        </ul>
    `
})
export class AppMenuComponent implements OnInit {

    model: MainMenu[];

    constructor(public app: AppComponent, private userMainMenuService: UserMainMenuService) {
    }

    ngOnInit() {
        this.userMainMenuService.getUserMainMenusByRoleId(JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).roles[0].id : null).then(menues => {
            this.model = menues;
        });
        // this.model = [
        //     {
        //         label: 'Favorites', icon: 'pi pi-fw pi-home',
        //         items: [
        //             {label: 'Dashboard Sales', icon: 'pi pi-fw pi-home', routerLink: ['/'], badge: '4', badgeClass: 'p-badge-info'},
        //             {label: 'Dashboard Analytics', icon: 'pi pi-fw pi-home',
        //                 routerLink: ['/favorites/dashboardanalytics'], badge: '2', badgeClass: 'p-badge-success'}
        //         ]
        //     },
        //     {
        //         label: 'UI Kit', icon: 'pi pi-fw pi-star', routerLink: ['/uikit'],
        //         items: [
        //             {label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'], badge: '6', badgeClass: 'p-badge-danger'},
        //             {label: 'Float Label', icon: 'pi pi-fw pi-bookmark', routerLink: ['/uikit/floatlabel']},
        //             {label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/uikit/invalidstate']},
        //             {label: 'Button', icon: 'pi pi-fw pi-mobile', routerLink: ['/uikit/button'], class: 'rotated-icon'},
        //             {label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'], badge: '6', badgeClass: 'p-badge-help'},
        //             {label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list']},
        //             {label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree']},
        //             {label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel']},
        //             {label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay']},
        //             {label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media']},
        //             {label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu']},
        //             {label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message']},
        //             {label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file']},
        //             {label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts']},
        //             {label: 'Misc', icon: 'pi pi-fw pi-circle-off', routerLink: ['/uikit/misc']}
        //         ]
        //     },
        //     {
        //         label: 'Utilities', icon: 'pi pi-fw pi-compass', routerLink: ['utilities'],
        //         items: [
        //             {label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'], badge: '6', badgeClass: 'p-badge-warning'},
        //             {label: 'Display', icon: 'pi pi-fw pi-desktop', routerLink: ['utilities/display']},
        //             {label: 'Elevation', icon: 'pi pi-fw pi-external-link', routerLink: ['utilities/elevation']},
        //             {label: 'FlexBox', icon: 'pi pi-fw pi-directions', routerLink: ['utilities/flexbox']},
        //             {label: 'Icons', icon: 'pi pi-fw pi-search', routerLink: ['utilities/icons']},
        //             {label: 'Text', icon: 'pi pi-fw pi-pencil', routerLink: ['utilities/text']},
        //             {label: 'Widgets', icon: 'pi pi-fw pi-star', routerLink: ['utilities/widgets']},
        //             {label: 'Grid System', icon: 'pi pi-fw pi-th-large', routerLink: ['utilities/grid']},
        //             {label: 'Spacing', icon: 'pi pi-fw pi-arrow-right', routerLink: ['utilities/spacing']},
        //             {label: 'Typography', icon: 'pi pi-fw pi-align-center', routerLink: ['utilities/typography']}
        //         ]
        //     },
        //     {
        //         label: 'Pages', icon: 'pi pi-fw pi-briefcase', routerLink: ['/pages'],
        //         items: [
        //             {label: 'Crud', icon: 'pi pi-fw pi-pencil', routerLink: ['/pages/crud']},
        //             {label: 'Calendar', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/pages/calendar']},
        //             {label: 'Timeline', icon: 'pi pi-fw pi-calendar', routerLink: ['/pages/timeline']},
        //             {label: 'Wizard', icon: 'pi pi-fw pi-star', routerLink: ['/pages/wizard']},
        //             {
        //                 label: 'Landing', icon: 'pi pi-fw pi-globe', badge: '2', badgeClass: 'p-badge-warning',
        //                 items: [
        //                     {label: 'Static', icon: 'pi pi-fw pi-globe', url: 'assets/pages/landing.html', target: '_blank'},
        //                     {label: 'Component', icon: 'pi pi-fw pi-globe', routerLink: ['/landing']}
        //                 ]
        //             },
        //             {label: 'Login', icon: 'pi pi-fw pi-sign-in', routerLink: ['/login']},
        //             {label: 'Invoice', icon: 'pi pi-fw pi-dollar', routerLink: ['/pages/invoice']},
        //             {label: 'Help', icon: 'pi pi-fw pi-question-circle', routerLink: ['/pages/help']},
        //             {label: 'Error', icon: 'pi pi-fw pi-times-circle', routerLink: ['/error']},
        //             {label: 'Not Found', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/notfound']},
        //             {label: 'Access Denied', icon: 'pi pi-fw pi-lock', routerLink: ['/access']},
        //             {label: 'Contact Us', icon: 'pi pi-fw pi-pencil', routerLink: ['/contactus']},
        //             {label: 'Empty', icon: 'pi pi-fw pi-circle-off', routerLink: ['/pages/empty']}
        //         ]
        //     },
        //     {
        //         label: 'Hierarchy', icon: 'pi pi-fw pi-align-left',
        //         items: [
        //             {
        //                 label: 'Submenu 1', icon: 'pi pi-fw pi-align-left',
        //                 items: [
        //                     {
        //                         label: 'Submenu 1.1', icon: 'pi pi-fw pi-align-left',
        //                         items: [
        //                             {label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-align-left'},
        //                             {label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-align-left'},
        //                             {label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-align-left'},
        //                         ]
        //                     },
        //                     {
        //                         label: 'Submenu 1.2', icon: 'pi pi-fw pi-align-left',
        //                         items: [
        //                             {label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-align-left'}
        //                         ]
        //                     },
        //                 ]
        //             },
        //             {
        //                 label: 'Submenu 2', icon: 'pi pi-fw pi-align-left',
        //                 items: [
        //                     {
        //                         label: 'Submenu 2.1', icon: 'pi pi-fw pi-align-left',
        //                         items: [
        //                             {label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-align-left'},
        //                             {label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-align-left'},
        //                         ]
        //                     },
        //                     {
        //                         label: 'Submenu 2.2', icon: 'pi pi-fw pi-align-left',
        //                         items: [
        //                             {label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-align-left'},
        //                         ]
        //                     },
        //                 ]
        //             }
        //         ]
        //     },
        //     {
        //         label: 'Start', icon: 'pi pi-fw pi-download',
        //         items: [
        //             {
        //                 label: 'Buy Now', icon: 'pi pi-fw pi-shopping-cart', url: ['https://www.primefaces.org/store']
        //             },
        //             {
        //                 label: 'Documentation', icon: 'pi pi-fw pi-info-circle', routerLink: ['/documentation']
        //             }
        //         ]
        //     }
        // ];
    }

    onKeydown(event: KeyboardEvent) {
        const nodeElement = (<HTMLDivElement>event.target);
        if (event.code === 'Enter' || event.code === 'Space') {
          nodeElement.click();
          event.preventDefault();
        }
    }
}
