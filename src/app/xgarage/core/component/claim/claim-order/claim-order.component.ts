import { Component, OnInit } from '@angular/core';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { ClaimService } from '../../../service/claim.service';
import { GenericComponent } from 'src/app/xgarage/common/generic/genericcomponent';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
    selector: 'app-claim-order',
    templateUrl: './claim-order.component.html',
    styles: [''],
    providers: [MessageService, ConfirmationService, DatePipe]
})
export class ClaimOrderComponent extends GenericComponent implements OnInit {

    constructor(private authService: AuthService,public datePipe: DatePipe, public route: ActivatedRoute, private router: Router, public breadcrumbService: AppBreadcrumbService, private claimService: ClaimService) {
        super(route, datePipe, breadcrumbService);
    }

    totalOrderAmount = 0;
    totalAmount = 0;
    delivaryTotal = 0;
    role: number = JSON.parse(this.authService.getStoredUser()).roles[0].id;

    ngOnInit(): void {
        if(localStorage.getItem('claim-order')) {
            localStorage.removeItem('claim-order')
        }
        this.getClaimOrders();
        this.breadcrumbService.setItems([{ 'label': 'Orders', routerLink: ['orders'] }]);
    }

    getClaimOrders() {
        this.claimService.getClaimOrders().subscribe(res => {
            console.log(res)
            res.forEach(data => {
                this.totalOrderAmount = this.totalOrderAmount + data.orderAmount;
                this.totalAmount = this.totalAmount + data.totalAmount;
                this.delivaryTotal = this.delivaryTotal + data.deliveryFees;
            })

            this.masterDtos = res;
        })
    }

    goOrderDetails(order: any) {
        localStorage.setItem('claim-order', JSON.stringify(order));
        this.router.navigate(['claim-order-details'], {queryParams: {}});
    }
}
