import { Component, OnInit } from '@angular/core';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';

@Component({
  selector: 'app-add-claim',
  templateUrl: './add-claim.component.html',
  styles: [
    `
    .wizard-card {width: 100% !important}
    .wizard-body {background: none; height: unset;}
    .wizard-card, .wizard-card-header {border-radius: 5px;}
    .tab:first-of-type {
        border-top-left-radius: 5px
    }
    .tab:last-of-type {
        border-top-right-radius: 5px
    }
    .wizard-body .wizard-wrapper .wizard-content {
        height: auto;
        min-height: auto;
    }

    .wizard-body .wizard-wrapper .wizard-content .wizard-card {
        height: 100%;
    }
    `
  ]
})
export class AddClaimComponent implements OnInit {

  constructor(private breadcrumbService: AppBreadcrumbService) { }

  activeTab = 'create-claim';
  car: any;
  ngOnInit(): void {
    this.breadcrumbService.setItems([{ 'label': 'Claims', routerLink: ['claims'] }, { 'label': 'Add Claim', routerLink: ['add-claim'] }]);
  }

  onCarFormEvent(event) {
    console.log(event)
    //temp object to hold car info data
    this.car = event;
    this.activeTab = 'create-claim';
  }

}
