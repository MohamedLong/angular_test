import { TenantService } from 'src/app/xgarage/common/service/tenant.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { trigger, style, transition, animate, AnimationEvent } from '@angular/animations';
import { MegaMenuItem } from 'primeng/api';
import { AppComponent } from './app.component';
import { AppMainComponent } from './app.main.component';
import { AuthService } from './auth/services/auth.service';
import { Router } from '@angular/router';
import { Tenant } from "src/app/xgarage/common/model/tenant";
@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    animations: [
        trigger('topbarActionPanelAnimation', [
            transition(':enter', [
                style({ opacity: 0, transform: 'scaleY(0.8)' }),
                animate('.12s cubic-bezier(0, 0, 0.2, 1)', style({ opacity: 1, transform: '*' })),
            ]),
            transition(':leave', [
                animate('.1s linear', style({ opacity: 0 }))
            ])
        ])
    ]
})
export class AppTopBarComponent {

    constructor(public appMain: AppMainComponent, public app: AppComponent,
        private authService: AuthService, private router: Router, private tenantService: TenantService) {
    }

    activeItem: number;
    userId: number;
    firstName: string;
    lastName: string;
    tenant: Tenant;
    tenantName: string;
    tenantType: string;



    model: MegaMenuItem[] = [
        {
            label: 'UI KIT',
            items: [
                [
                    {
                        label: 'UI KIT 1',
                        items: [
                            { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                            { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
                            { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', routerLink: ['/uikit/floatlabel'] },
                            { label: 'Button', icon: 'pi pi-fw pi-mobile', routerLink: ['/uikit/button'] },
                            { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] }
                        ]
                    }
                ],
                [
                    {
                        label: 'UI KIT 2',
                        items: [
                            { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
                            { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
                            { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
                            { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
                            { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] }
                        ]
                    }
                ],
                [
                    {
                        label: 'UI KIT 3',
                        items: [
                            { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
                            { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
                            { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'] },
                            { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
                            { label: 'Misc', icon: 'pi pi-fw pi-circle-off', routerLink: ['/uikit/misc'] }
                        ]
                    }
                ]
            ]
        },
        {
            label: 'UTILITIES',
            items: [
                [
                    {
                        label: 'UTILITIES 1',
                        items: [
                            { label: 'Display', icon: 'pi pi-fw pi-desktop', routerLink: ['utilities/display'] },
                            { label: 'Elevation', icon: 'pi pi-fw pi-external-link', routerLink: ['utilities/elevation'] }
                        ]
                    },
                    {
                        label: 'UTILITIES 2',
                        items: [
                            { label: 'FlexBox', icon: 'pi pi-fw pi-directions', routerLink: ['utilities/flexbox'] }
                        ]
                    }
                ],
                [
                    {
                        label: 'UTILITIES 3',
                        items: [
                            { label: 'Icons', icon: 'pi pi-fw pi-search', routerLink: ['utilities/icons'] }
                        ]
                    },
                    {
                        label: 'UTILITIES 4',
                        items: [
                            { label: 'Text', icon: 'pi pi-fw pi-pencil', routerLink: ['utilities/text'] },
                            { label: 'Widgets', icon: 'pi pi-fw pi-star', routerLink: ['utilities/widgets'] }
                        ]
                    }
                ],
                [
                    {
                        label: 'UTILITIES 5',
                        items: [
                            { label: 'Grid System', icon: 'pi pi-fw pi-th-large', routerLink: ['utilities/grid'] },
                            { label: 'Spacing', icon: 'pi pi-fw pi-arrow-right', routerLink: ['utilities/spacing'] },
                            { label: 'Typography', icon: 'pi pi-fw pi-align-center', routerLink: ['utilities/typography'] }
                        ]
                    }
                ],
            ]
        }
    ];

    @ViewChild('searchInput') searchInputViewChild: ElementRef;


    ngOnInit(): void {
        if (this.authService.isLoggedIn()) {

            this.firstName = JSON.parse(this.authService.getStoredUser()).firstName;
            this.lastName = JSON.parse(this.authService.getStoredUser()).lastName;
            this.tenantName = JSON.parse(this.authService.getStoredUser()).tenant.name;
            this.tenantType = JSON.parse(this.authService.getStoredUser()).tenant.tenantType.name;
        }
    }

    onSearchAnimationEnd(event: AnimationEvent) {
        switch (event.toState) {
            case 'visible':
                this.searchInputViewChild.nativeElement.focus();
                break;
        }
    }

    viewProfile(id: number) {
        localStorage.removeItem('supplierId');
        this.userId = JSON.parse(this.authService.getStoredUser()).id;
        this.tenantService.selectedTenantId = this.userId;
        this.router.navigate(['/supplier-profile']);
    }

    doLogout() {
        this.authService.doLogoutUser();
        this.router.navigate(['/login']);
    }
}
