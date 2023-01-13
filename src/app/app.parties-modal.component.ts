import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {MenuService} from './app.menu.service';
import {AppMainComponent} from './app.main.component';
import { AccParties } from './erp/common/model/parties';
import { AccPartyTypes } from './erp/common/model/patiestypes';
import { PartiesTypesService } from './erp/common/service/partiestypeservice';
import { PartiesService } from './erp/common/service/partiesservice';
import { MessageService } from 'primeng/api';

@Component({
    /* tslint:disable:component-selector */
    selector: '[app-partiesmodal]',
    /* tslint:enable:component-selector */
    template: `
        <ng-container>
        
        </ng-container>
    `
})
export class AppPartiesModalComponent implements OnInit, OnDestroy {

    parties: AccParties[];

    party: AccParties;

    @Input() partyTypes: AccPartyTypes[];

    selectedPartyType: AccPartyTypes;

    @Input() partiesDialog: boolean;

    submitted: boolean;

    constructor(public app: AppMainComponent, private messageService: MessageService, private partiesService: PartiesService, private partyTypesService: PartiesTypesService, public router: Router, private cd: ChangeDetectorRef, private menuService: MenuService) {
        this.party = {};
    }

    ngOnInit(): void {
        console.log(this.partyTypes);
        
    }

    ngOnDestroy() {
    }
}
